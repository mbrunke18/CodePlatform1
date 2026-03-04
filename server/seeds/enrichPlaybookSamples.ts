import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { playbookLibrary } from '../../shared/schema';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const PLAYBOOK_ENRICHMENTS: Record<string, any> = {

  "Aggressive Pricing Disruption": {
    whyItMatters: "Companies that respond within 12 hours retain an average of 91% of at-risk pipeline. Companies that take 72+ hours retain 58%. (Source: Bain competitive response analysis, 2023.)",
    signalSources: [
      "Competitor pricing page changes (web monitoring)",
      "Press release keywords: 'price reduction,' 'free tier,' 'accessible pricing,' 'value pricing'",
      "Sales team field reports: 3+ reps report same competitor pricing mention in a single week",
      "Win/loss data shift: competitor win rate increases 10%+ in a 30-day window"
    ],
    enrichedPhases: [
      {
        id: "phase-1",
        name: "Immediate Assessment",
        timeWindow: "Hours 0–4",
        objective: "Understand the full scope before any external communication.",
        tasks: [
          {
            role: "CFO",
            priority: "lead",
            deadline: "within 2 hours",
            items: [
              "Pull current gross margin by product line",
              "Model three response scenarios: (A) Match competitor pricing, (B) Partial match with value reinforcement, (C) Hold price and accelerate value narrative",
              "For each scenario: calculate 90-day margin impact, customer churn risk, and revenue exposure by segment",
              "Bring outputs to the Phase 1 decision meeting"
            ]
          },
          {
            role: "CMO",
            priority: "lead",
            deadline: "within 2 hours",
            items: [
              "Pull NPS scores from last 18 months segmented by price sensitivity",
              "Identify which customer segments are highest flight risk vs. highest loyalty",
              "Flag any pending renewal accounts within 60 days — these are immediate exposure",
              "Draft a one-page competitive positioning brief (internal only)"
            ]
          },
          {
            role: "Sales Leadership",
            priority: "required",
            deadline: "within 3 hours",
            items: [
              "Pull all open opportunities where this competitor is present (CRM query)",
              "Flag deals closing within 30 days — these become the priority list",
              "Brief regional VPs: no pricing concessions, no public commentary until Phase 2 decision",
              "Collect field intelligence: What are customers saying? How is the competitor framing this?"
            ]
          }
        ],
        restrictions: [
          "No press releases or public statements",
          "No customer communications",
          "No pricing changes",
          "No social media response"
        ],
        decisionGate: {
          title: "Phase 1 → Phase 2 Decision Gate",
          criteria: [
            "CFO scenario models completed (all three, with numbers)",
            "CMO has identified the top 20 at-risk accounts",
            "Sales has quantified the pipeline at risk (dollar amount)",
            "A response posture has been selected by CEO + CFO: Match / Partial / Hold"
          ],
          escalation: "If decision cannot be reached, escalate to board chair. Do not proceed without a posture decision."
        }
      },
      {
        id: "phase-2",
        name: "Response Execution",
        timeWindow: "Hours 4–8",
        objective: "Execute the chosen posture internally. Prepare external-facing assets.",
        tasks: [
          {
            role: "CFO + Finance (Scenario A: Match)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Draft board notification memo (notification, not approval)",
              "Initiate pricing system updates (not live yet — pending Phase 3 sign-off)",
              "Activate pre-approved $500K budget for customer retention offers on at-risk accounts"
            ]
          },
          {
            role: "CMO + Product (Scenario B: Partial Match)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Identify 2–3 value-adds that can be accelerated or repriced at current margin",
              "Draft 'here's what you get that they don't' customer communication",
              "Provide sales updated battle card with specific value vs. competitor talking points"
            ]
          },
          {
            role: "CMO + Sales Leadership (Scenario C: Hold)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Finalize value narrative: what does the customer get for paying more?",
              "Draft 3 customer-facing communication versions: account retention, renewal defense, general market",
              "Brief investor relations if company is public — they will receive questions"
            ]
          },
          {
            role: "Legal",
            priority: "required",
            deadline: "within this phase",
            items: [
              "Review any planned communications for compliance (no competitor disparagement)",
              "Confirm pricing change process if applicable (regulatory requirements by industry)"
            ]
          }
        ],
        restrictions: [],
        decisionGate: {
          title: "Phase 2 → Phase 3 Decision Gate",
          criteria: [
            "Board has been notified (not consulted — notified)",
            "Legal has cleared all external communications",
            "Sales has received updated battle cards and briefing",
            "Customer-facing team knows the response posture and their talking points",
            "Pricing changes (if any) are staged and ready — not live yet"
          ],
          escalation: null
        }
      },
      {
        id: "phase-3",
        name: "Market Response",
        timeWindow: "Hours 8–12",
        objective: "Coordinated external execution with no contradictions across channels.",
        tasks: [
          {
            role: "CEO",
            priority: "lead",
            deadline: "before anything goes public",
            items: [
              "Call top 5 accounts personally — before anything goes public"
            ]
          },
          {
            role: "Finance",
            priority: "required",
            deadline: "Hour 9",
            items: [
              "Pricing changes go live (if Scenario A or B)"
            ]
          },
          {
            role: "Account Executives",
            priority: "required",
            deadline: "Hour 9",
            items: [
              "Contact the at-risk list with the retention communication"
            ]
          },
          {
            role: "Communications",
            priority: "required",
            deadline: "Hour 10",
            items: [
              "Press response goes out if competitor made public statements"
            ]
          },
          {
            role: "Customer Success",
            priority: "required",
            deadline: "Hour 12",
            items: [
              "Proactively contact all accounts in renewal window"
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      },
      {
        id: "phase-4",
        name: "72-Hour Sustain",
        timeWindow: "Days 2–7",
        objective: "Monitor, measure, and adjust. Prevent the situation from drifting.",
        tasks: [
          {
            role: "Sales Leadership",
            priority: "required",
            deadline: "daily",
            items: [
              "Daily pipeline review: which at-risk accounts have been contacted? Responses?",
              "Win/loss tracking begins immediately — did competitor pricing actually move deals?"
            ]
          },
          {
            role: "CFO",
            priority: "required",
            deadline: "day 7",
            items: [
              "Review actual vs. projected margin impact at day 7",
              "If churn exceeds model: trigger secondary response budget (requires board approval above $500K)"
            ]
          },
          {
            role: "CMO",
            priority: "required",
            deadline: "week 2",
            items: [
              "Assess: Is the competitor's move gaining traction or stalling?",
              "Adjust narrative if market response is different than modeled"
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      }
    ],
    communicationAssets: [
      {
        type: "board_notification",
        label: "Board Notification",
        timing: "Hour 6 — notification, not approval",
        subject: "Competitive Pricing Action — [Competitor Name] — Response Posture Selected",
        body: "Board Members,\n\n[Competitor] announced a [X%] price reduction on [date]. Our response team completed scenario analysis within 4 hours. We have selected [Scenario A/B/C] as our posture.\n\nPipeline at risk: $[X]M across [N] accounts. At-risk accounts have been identified and account executive outreach begins at [time].\n\nProjected 90-day margin impact: [range from CFO model].\n\nNo board action required at this stage. We will provide a full briefing at the next scheduled meeting or sooner if conditions change materially.\n\n[CEO Name]"
      },
      {
        type: "sales_battle_card",
        label: "Sales Battle Card",
        timing: "Distribute at Hour 8",
        subject: null,
        body: "WHEN A CUSTOMER ASKS ABOUT [COMPETITOR]'S NEW PRICING:\n\n\"I'm aware of their announcement. Here's what I'd ask you to consider: [Value point 1]. [Value point 2]. [Value point 3].\n\nWhat I can tell you is that our pricing reflects [specific value statement]. If budget is a genuine constraint for you, I'd like to have that conversation directly.\"\n\nDO NOT SAY: Don't say their pricing is unsustainable. Don't make promises about our future pricing. Don't disparage their product quality."
      },
      {
        type: "customer_outreach",
        label: "At-Risk Account Outreach",
        timing: "Hour 9 — personal, not automated",
        subject: null,
        body: "\"[First name] — I wanted to reach out before you heard about this elsewhere. [Competitor] made a pricing move yesterday. I imagine you may have questions.\n\nI'd like 20 minutes this week to walk you through what this means and what we're doing in response. Are you available [two time options]?\""
      }
    ],
    riskIndicators: {
      green: [
        "At-risk account outreach response rate above 60% within 48 hours",
        "No deals lost to competitor in first 7 days that weren't already flagged",
        "Sales team reporting consistent message usage in the field"
      ],
      yellow: [
        "2+ enterprise accounts request pricing review outside the at-risk list",
        "Competitor pricing announcement gains major press coverage",
        "Internal pricing requests from sales exceed 15% of pipeline in a week"
      ],
      red: [
        "Any Tier 1 account (top 10% of revenue) requests a pricing meeting",
        "A competitor's pricing announcement causes a public analyst note on your company",
        "Sales win rate drops more than 8% in a 2-week window"
      ]
    },
    outcomeFraming: {
      at12hours: [
        "Response posture selected, approved, and communicated internally",
        "At-risk accounts contacted by account executives",
        "No contradictory public statements from any company representative",
        "Board notified with a clear memo"
      ],
      at30days: [
        "Pipeline at-risk accounts retained at 85%+ rate",
        "No uncontrolled pricing concessions outside the approved response posture",
        "Win rate stabilized at pre-announcement baseline or better",
        "Margin impact within the range modeled in Phase 1"
      ],
      failureModes: [
        "Individual VPs making pricing promises to save their accounts",
        "Sales team improvising without battle cards, creating inconsistent positioning",
        "First customer communication going out 36+ hours after the competitor announcement",
        "Board learning about this from a news alert instead of a proactive memo"
      ]
    }
  },

  "AI Competitive Disruption": {
    whyItMatters: "The average enterprise response to a major AI competitive move takes 94 days. Organizations that contained competitive erosion did it in under 21. (Source: McKinsey Technology Adoption study, 2024.)",
    signalSources: [
      "Competitor press releases with AI/ML capability keywords",
      "App store release notes, product changelogs, G2/Gartner review spikes",
      "LinkedIn mentions from competitor employees about AI launches",
      "Customer inbound: 'Does your platform do what [competitor] just announced?'",
      "Analyst notes and tech press: TechCrunch, VentureBeat, The Information"
    ],
    enrichedPhases: [
      {
        id: "phase-1",
        name: "Capability Gap Assessment",
        timeWindow: "Hours 0–4",
        objective: "Understand exactly what the competitor shipped, what it does, and how close your organization is from matching or leapfrogging it.",
        tasks: [
          {
            role: "CTO",
            priority: "lead",
            deadline: "within 3 hours",
            items: [
              "Obtain and test the competitor capability (free trial, demo, or analyst briefing)",
              "Assess: Is this genuinely new capability, or repositioned existing functionality?",
              "Map against your current AI roadmap: Where does this fall on what's already planned?",
              "Produce a plain-language brief for the CEO: What did they ship? Does it work? How long to match it? What would it take to leapfrog it?",
              "Identify: Do we have any existing capability that is comparable but not marketed as AI?"
            ]
          },
          {
            role: "Chief Product Officer",
            priority: "lead",
            deadline: "within 3 hours",
            items: [
              "Pull customer usage data: which features overlap with the competitor's announcement?",
              "Identify the 10 customers most likely to ask about this — flag for CEO/sales outreach",
              "Assess: Is this primarily a B2B or B2C capability play? Who is the target buyer?",
              "Check: Is there any pending roadmap item that could be accelerated?"
            ]
          },
          {
            role: "CMO",
            priority: "required",
            deadline: "within 4 hours",
            items: [
              "Monitor social and press in real time — is this gaining traction or is it hype?",
              "Pull competitor's messaging: How are they framing this? What claims are they making?",
              "Assess: What is the narrative they are trying to own? (speed, accuracy, cost, simplicity)",
              "Brief PR on response options: silence / acknowledgment / counter-narrative"
            ]
          }
        ],
        restrictions: [
          "No public statements about AI roadmap or capabilities",
          "No engineering resources redirected without CTO decision",
          "No customer promises about matching this capability by a specific date"
        ],
        decisionGate: {
          title: "Phase 1 → Phase 2 Decision Gate",
          criteria: [
            "CTO assessment completed: Is this real, and how close are we?",
            "CPO has identified the overlap with existing product and the at-risk customer set",
            "CEO has been briefed and has selected a posture: Accelerate / Differentiate / Acquire / Wait"
          ],
          escalation: null
        }
      },
      {
        id: "phase-2",
        name: "Strategic Posture Execution",
        timeWindow: "Hours 4–8",
        objective: "Execute internally on the chosen posture. Prepare external-facing assets.",
        tasks: [
          {
            role: "CTO + Engineering (Posture A: Accelerate)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Identify the 1–2 roadmap items that most closely address the gap",
              "Get a realistic estimate: can this ship in 30, 60, or 90 days?",
              "Determine true cost of acceleration: team impact, technical debt, items displaced",
              "Draft internal communication to engineering: the 'why' behind the reprioritization",
              "Activate pre-approved budget for contract engineering resources if needed"
            ]
          },
          {
            role: "CMO + CPO (Posture B: Differentiate)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Define the counter-narrative: What does your AI approach do that theirs doesn't?",
              "Identify the specific customer outcome your approach delivers better",
              "Draft the 'our AI philosophy' positioning document",
              "Begin drafting thought leadership content (draft only — not for publication yet)"
            ]
          },
          {
            role: "CEO + CFO + Corporate Development (Posture C: Acquire)",
            priority: "conditional",
            deadline: "within 48 hours",
            items: [
              "Identify 3–5 acquisition or partnership candidates within 48 hours",
              "Pre-screen: capability match, team quality, integration complexity, price range",
              "Activate M&A advisors if applicable — NDAs, initial outreach"
            ]
          },
          {
            role: "CPO + Sales Leadership (Posture D: Wait)",
            priority: "conditional",
            deadline: "within this phase",
            items: [
              "Sales receives explicit guidance: how to handle customer questions about AI",
              "Customer Success prepares a response for inbound: 'Here's our roadmap direction'",
              "Set a 30-day tripwire: if competitor gains X% market traction by day 30, re-evaluate"
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      },
      {
        id: "phase-3",
        name: "External Positioning",
        timeWindow: "Hours 8–12",
        objective: "Control your narrative. Not react to theirs.",
        tasks: [
          {
            role: "CTO or CEO",
            priority: "lead",
            deadline: "Hour 9",
            items: [
              "Post a brief, confident statement — not defensive, not dismissive"
            ]
          },
          {
            role: "Sales",
            priority: "required",
            deadline: "Hour 9",
            items: [
              "Receive updated battle cards specifically addressing 'what about [competitor]'s AI?'"
            ]
          },
          {
            role: "Customer Success",
            priority: "required",
            deadline: "Hour 10",
            items: [
              "Call the 10 at-risk accounts identified in Phase 1"
            ]
          },
          {
            role: "PR / Communications",
            priority: "required",
            deadline: "Hour 10",
            items: [
              "Reach out proactively to 2–3 analyst relationships with your posture",
              "Begin drafting thought leadership piece (Posture B) or roadmap teaser (Posture A)"
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      },
      {
        id: "phase-4",
        name: "30-Day Market Positioning",
        timeWindow: "Days 2–30",
        objective: "Execute the posture in the market. Measure whether it's working.",
        tasks: [
          {
            role: "CMO / CTO",
            priority: "required",
            deadline: "week 1",
            items: [
              "Publish thought leadership or roadmap signal (depending on posture)"
            ]
          },
          {
            role: "Sales Operations",
            priority: "required",
            deadline: "week 2",
            items: [
              "Win/loss tracking begins — is the competitor's capability showing up as a loss reason?"
            ]
          },
          {
            role: "CPO",
            priority: "required",
            deadline: "week 3",
            items: [
              "Customer advisory board (informal) — get input from 5 trusted customers"
            ]
          },
          {
            role: "CTO",
            priority: "required",
            deadline: "week 4",
            items: [
              "Publish technical perspective (Posture B) OR announce acceleration milestone (Posture A)"
            ]
          },
          {
            role: "CEO + Leadership Team",
            priority: "required",
            deadline: "day 30",
            items: [
              "Full strategic review: is the posture working? Adjust if needed."
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      }
    ],
    communicationAssets: [
      {
        type: "executive_statement",
        label: "CEO/CTO External Statement",
        timing: "Hour 9 — optional, posture-dependent",
        subject: null,
        body: "\"We've seen [Competitor]'s announcement. The market's appetite for AI-native execution is real — we've been building toward it for [X] months. What we believe is different about our approach: [one specific, non-hype statement]. We'll have more to share in the coming weeks.\""
      },
      {
        type: "sales_battle_card",
        label: "Sales Battle Card",
        timing: "Distribute at Hour 9",
        subject: null,
        body: "WHEN A PROSPECT ASKS: 'What's your AI strategy compared to [Competitor]?'\n\n\"Great question. [Competitor] has made AI a headline feature. Here's how we think about it differently: [specific differentiation].\n\nThe question I'd ask is: what outcome do you actually need AI to deliver for your organization? Because that determines whether the right answer is their approach or ours.\"\n\nIF THEY PRESS ON A SPECIFIC FEATURE: \"That's on our roadmap. Here's what we have today that addresses the underlying need: [specific feature].\""
      }
    ],
    riskIndicators: {
      green: [
        "Customer inquiries about competitor's AI are being handled consistently",
        "Win rate holds within 5% of pre-announcement baseline",
        "Engineering team is executing on posture A roadmap without significant disruption"
      ],
      yellow: [
        "3+ enterprise accounts formally request a product roadmap briefing",
        "Competitor's announcement generates analyst coverage that references your company by name",
        "Two or more loss reasons in CRM cite competitor's AI capability within 30 days"
      ],
      red: [
        "A Tier 1 account requests a meeting specifically about AI capabilities and evaluation criteria",
        "Sales team is improvising AI roadmap promises to customers",
        "Competitor's capability becomes the default industry reference in analyst reports"
      ]
    },
    outcomeFraming: {
      at12hours: [
        "Clear internal posture selected and communicated",
        "At-risk accounts have been proactively contacted",
        "No improvised external statements from any team member",
        "Engineering and product have clear guidance on what changes (if anything)"
      ],
      at30days: [
        "Loss rate attributable to competitor's AI capability is below 8%",
        "Your AI narrative is being used consistently by sales, marketing, and leadership",
        "You have a milestone — product, content, or partnership — to point to in the next 60 days"
      ],
      failureModes: [
        "Sales reps making AI roadmap promises that engineering hasn't committed to",
        "No public response in first 72 hours — silence reads as having no answer",
        "Internal teams giving inconsistent answers to the same customer question",
        "Losing two or more enterprise deals before the posture is even communicated"
      ]
    }
  },

  "Compound: Geopolitical + Supply Chain Disruption": {
    whyItMatters: "The median enterprise takes 3 weeks to form a supply chain response team after a geopolitical trigger. Organizations with pre-built execution playbooks contain cost exposure within 5 days — an average of $4.2M in avoided loss per major disruption event. (Source: Deloitte Supply Chain Resilience Report, 2023.)",
    signalSources: [
      "Government announcements: executive orders, sanctions lists, export control changes",
      "Freight indices: sudden Baltic Dry Index shifts, port congestion alerts",
      "News: keywords tied to specific geographies in your supplier network",
      "Supplier communications: proactive alerts, force majeure language, delivery delays",
      "Internal signals: procurement team flags, 3PL partner alerts"
    ],
    enrichedPhases: [
      {
        id: "phase-1",
        name: "Exposure Mapping",
        timeWindow: "Hours 0–4",
        objective: "Know exactly what is at risk before any external communication or procurement action.",
        tasks: [
          {
            role: "Chief Supply Chain Officer / COO",
            priority: "lead",
            deadline: "within 3 hours",
            items: [
              "Map every Tier 1 supplier with operations in the affected geography",
              "Identify Tier 2 dependencies (your supplier's suppliers) in the same region",
              "Quantify days of current inventory buffer by SKU or product category",
              "Quantify lead time from alternative sourcing regions (pre-qualified vs. unvetted)",
              "Quantify revenue exposure if disruption continues for 30, 60, 90 days",
              "Flag single-source dependencies — these are the critical vulnerabilities"
            ]
          },
          {
            role: "CFO",
            priority: "lead",
            deadline: "within 3 hours",
            items: [
              "Pull financial exposure: open purchase orders in the affected region",
              "Calculate working capital impact if alternative sourcing requires higher-cost providers",
              "Assess: Does the $2M pre-approved budget cover initial containment, or is board approval needed?",
              "Review any supply chain insurance policies — document what is and is not covered",
              "Brief external auditors if disruption may affect earnings guidance (public companies)"
            ]
          },
          {
            role: "General Counsel / CLO",
            priority: "required",
            deadline: "within 4 hours",
            items: [
              "Review existing supplier contracts for force majeure clauses",
              "Identify which contracts allow alternative sourcing without penalty",
              "Flag any OFAC compliance issues if sanctions are involved",
              "Assess litigation exposure from customer commitments you may not be able to fulfill"
            ]
          },
          {
            role: "Chief Commercial Officer / Sales Leadership",
            priority: "required",
            deadline: "within 4 hours",
            items: [
              "Identify customer commitments at risk: contracted delivery dates that may be affected",
              "Segment by risk: which customers have penalty clauses, which have flexibility?",
              "Do NOT communicate with customers yet — Phase 2 decision first"
            ]
          }
        ],
        restrictions: [
          "No customer communications until Phase 2 posture is set",
          "No alternative supplier orders without CFO budget authorization",
          "No public statements on the geopolitical situation"
        ],
        decisionGate: {
          title: "Phase 1 → Phase 2 Decision Gate",
          criteria: [
            "Exposure map complete: which suppliers, which product lines, what dollar exposure",
            "Inventory buffer quantified by product category (days of cover)",
            "At least 3 alternative sourcing options identified, even if not yet contracted",
            "Legal has cleared the force majeure and sanctions compliance questions",
            "CEO has been briefed and has authorized Phase 2 budget draw-down"
          ],
          escalation: "If CEO is unavailable: COO has authority to authorize Phase 2 within the pre-approved $2M budget."
        }
      },
      {
        id: "phase-2",
        name: "Containment and Stabilization",
        timeWindow: "Hours 4–48",
        objective: "Stop the bleeding. Activate alternatives. Protect customer commitments where possible.",
        tasks: [
          {
            role: "Supply Chain Team",
            priority: "lead",
            deadline: "within 12 hours",
            items: [
              "Activate pre-qualified alternative suppliers — place qualifying orders within pre-approved budget to secure capacity before market tightens",
              "For single-source items with no alternative: begin spot market procurement",
              "Request expedited freight for any in-transit shipments that can be rerouted",
              "Increase safety stock orders on unaffected categories (demand will shift)"
            ]
          },
          {
            role: "Finance",
            priority: "required",
            deadline: "within 12 hours",
            items: [
              "Activate the $2M pre-approved budget — document every spend with disruption attribution",
              "Model the cost delta: alternative sourcing cost vs. original contract cost",
              "Begin insurance claim documentation immediately (time-sensitive for most policies)"
            ]
          },
          {
            role: "Operations / Manufacturing",
            priority: "required",
            deadline: "within 24 hours",
            items: [
              "Triage which product lines get available material first: highest margin, contractually committed, or highest strategic priority",
              "Prepare for potential production slowdown: identify which capacity can be idled without structural damage"
            ]
          },
          {
            role: "Commercial / Sales",
            priority: "required",
            deadline: "within 24 hours",
            items: [
              "Develop three customer communication tiers: Tier A (penalty clauses + near-term deliveries), Tier B (upcoming deliveries, no penalty), Tier C (60+ days lead time — monitor only)",
              "Tier A: CEO or SVP call. Personal. Proactive. Before they call you.",
              "Tier B: Account executive outreach. Honest about delay risk. Offer options.",
              "Tier C: Monitor. Communicate if situation worsens by Day 14."
            ]
          }
        ],
        restrictions: [],
        decisionGate: {
          title: "Phase 2 → Phase 3 Decision Gate",
          criteria: [
            "Legal has cleared all external communications for sanctions and export control language",
            "Alternative supplier orders placed for at least 60% of disrupted volume",
            "Tier A customer list finalized with account owner assigned to each",
            "Insurance claim filed"
          ],
          escalation: null
        }
      },
      {
        id: "phase-3",
        name: "Customer Communication",
        timeWindow: "Hours 24–72",
        objective: "Proactive outreach to every affected customer before they contact you.",
        tasks: [
          {
            role: "CEO / Senior Commercial Leader",
            priority: "lead",
            deadline: "Hour 24",
            items: [
              "Personal calls to all Tier A accounts (penalty clauses, near-term deliveries)",
              "Specific commitment: current status of their orders, what you're doing about it, honest delivery estimate"
            ]
          },
          {
            role: "Account Executives",
            priority: "required",
            deadline: "Hour 48",
            items: [
              "Outreach to all Tier B accounts with consistent message (no improvising)",
              "Document every conversation in CRM with date, commitment made, follow-up date"
            ]
          },
          {
            role: "Legal / Investor Relations",
            priority: "required",
            deadline: "Hour 48",
            items: [
              "Press response drafted and approved — do not wait to be asked",
              "Investor/analyst notification if material to guidance (public companies)"
            ]
          }
        ],
        restrictions: [
          "No unilateral delivery commitments without supply chain confirmation of available capacity",
          "All Tier A communications must be documented verbatim — litigation risk"
        ],
        decisionGate: null
      },
      {
        id: "phase-4",
        name: "Structural Resilience",
        timeWindow: "Days 5–30",
        objective: "Prevent this from happening again. Turn the disruption into a structural improvement.",
        tasks: [
          {
            role: "Supply Chain Team",
            priority: "required",
            deadline: "day 14",
            items: [
              "Complete alternative supplier qualification — not just emergency use, make it permanent",
              "Update single-source dependency map — eliminate the highest-risk single points of failure"
            ]
          },
          {
            role: "CFO",
            priority: "required",
            deadline: "day 14",
            items: [
              "Model the cost of permanent dual-sourcing vs. the disruption cost just incurred",
              "Board briefing at Day 14: situation report, containment status, structural changes underway"
            ]
          },
          {
            role: "Legal",
            priority: "required",
            deadline: "day 30",
            items: [
              "Post-disruption contract review: do customer and supplier contracts need force majeure clause updates?"
            ]
          }
        ],
        restrictions: [],
        decisionGate: null
      }
    ],
    communicationAssets: [
      {
        type: "board_notification",
        label: "Board Notification",
        timing: "Hour 6 — notification, not approval",
        subject: "Supply Chain Disruption — [Event Name] — Exposure Contained, Response Active",
        body: "Board Members,\n\n[Geopolitical event] has created supply chain exposure for [specific product/supplier categories]. Our response team has been active since [time].\n\nCurrent exposure: $[X]M in at-risk purchase orders and $[X]M in customer delivery commitments across [N] accounts.\n\nActions underway: alternative supplier activation, Tier A customer proactive outreach (begins within 24 hours), insurance claim filed, legal review of all contracts completed.\n\nPre-approved budget draw-down authorized: $[X]M of $2M available.\n\nNo board action required at this stage. Full briefing at Day 14 or sooner if exposure exceeds pre-approved parameters.\n\n[CEO Name]"
      },
      {
        type: "customer_outreach",
        label: "Tier A Account Call Script",
        timing: "Hour 24 — CEO or SVP, personal call",
        subject: null,
        body: "\"[First name], I'm calling before you had to call me. We've identified that [geopolitical event] is affecting a portion of our supply chain. Here is our current assessment of your specific orders: [specific situation].\n\nHere is what we're doing about it: [specific actions taken].\n\nHere is our current commitment to you: [honest delivery estimate].\n\nI want you to hear this from me directly, and I want to stay in close contact with you through this. Can we schedule a weekly update call for the next 4 weeks?\""
      },
      {
        type: "press_response",
        label: "Press Inquiry Response",
        timing: "Approve by Hour 48",
        subject: null,
        body: "\"[Company] is actively monitoring [geopolitical situation] and its potential impact on our operations. We have established response protocols and are in direct communication with our supply chain partners and customers. We are not currently in a position to provide specifics, but we are committed to transparency with our stakeholders as the situation develops.\""
      }
    ],
    riskIndicators: {
      green: [
        "Alternative sourcing secured within 72 hours for all single-source critical items",
        "No Tier A customers have escalated beyond the initial outreach",
        "Insurance claim filed and adjuster engaged",
        "Production/operations running within 85% of normal capacity"
      ],
      yellow: [
        "One or more single-source items cannot be replaced within 30 days",
        "A Tier A customer is considering force majeure declaration on their end",
        "Spot market pricing for critical inputs exceeds 2x normal cost",
        "Situation escalates geopolitically: additional sanctions, port closures, conflict expansion"
      ],
      red: [
        "A Tier A customer exercises a penalty clause or issues a formal default notice",
        "Alternative sourcing cannot cover more than 50% of disrupted volume",
        "The geopolitical situation expands to a second geography in your supply chain",
        "Media reports name your company specifically as exposed — investor inquiries spike"
      ]
    },
    outcomeFraming: {
      at12hours: [
        "Full exposure map completed",
        "Alternative sourcing options activated (even if not fully contracted)",
        "Tier A customer outreach plan ready to execute",
        "CEO and board notified with clear memo"
      ],
      at30days: [
        "Total cost of disruption below the modeled worst-case (90-day scenario)",
        "Permanent dual-sourcing established for the top 3 single-source dependencies identified",
        "No Tier A customer relationship materially damaged",
        "Post-incident playbook updated with learnings for the next event"
      ],
      failureModes: [
        "Customers learn about the disruption from press or industry contacts before hearing from you",
        "Individual sales reps make delivery commitments that operations cannot keep",
        "Legal discovers a contract penalty has been triggered that wasn't flagged in Phase 1",
        "The organization spends the first 72 hours in internal meetings without a single customer or supplier conversation"
      ]
    }
  }
};

async function run() {
  console.log("Starting playbook enrichment seed...");

  for (const [name, enrichment] of Object.entries(PLAYBOOK_ENRICHMENTS)) {
    const results = await db
      .select({ id: playbookLibrary.id, name: playbookLibrary.name })
      .from(playbookLibrary)
      .where(eq(playbookLibrary.name, name));

    if (results.length === 0) {
      console.log(`  SKIPPED: "${name}" — not found in database`);
      continue;
    }

    for (const row of results) {
      await db
        .update(playbookLibrary)
        .set({
          whyItMatters: enrichment.whyItMatters,
          signalSources: enrichment.signalSources,
          enrichedPhases: enrichment.enrichedPhases,
          communicationAssets: enrichment.communicationAssets,
          riskIndicators: enrichment.riskIndicators,
          outcomeFraming: enrichment.outcomeFraming,
        })
        .where(eq(playbookLibrary.id, row.id));

      console.log(`  ENRICHED: "${row.name}" (${row.id})`);
    }
  }

  console.log("Done.");
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
