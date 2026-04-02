# ACUETIC STRATEGIC INTELLIGENCE PLATFORM
## Complete Demo & Training Guide

**Version**: 2.0 | **Date**: September 2025  
**Platform**: Acuetic Strategic Intelligence  
**Tagline**: "See Clearer. Lead Bolder."

---

## TABLE OF CONTENTS

1. [Platform Overview](#platform-overview)
2. [Navigation Structure](#navigation-structure)
3. [Demo Scenario Walkthroughs](#demo-scenario-walkthroughs)
4. [Tab Structure Guide](#tab-structure-guide)
5. [Activities & Details Locations](#activities--details-locations)
6. [Training Scripts](#training-scripts)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## PLATFORM OVERVIEW

### **Core Value Proposition**
Acuetic transforms organizational decision-making through AI-driven strategic intelligence, crisis response management, and real-time collaboration capabilities.

### **Target Audience**
- **Primary**: C-Suite executives (CEO, COO, CFO, CTO)
- **Secondary**: VP-level strategic planning teams
- **Tertiary**: Operations managers and crisis response teams

### **Key Differentiators**
1. **5 AI Intelligence Modules** providing comprehensive organizational insights
2. **Enterprise-grade crisis management** with one-click activation
3. **Real-time collaboration** and task management
4. **Professional Fortune 500 presentation** quality

---

## NAVIGATION STRUCTURE

### **Primary Navigation: Left Sidebar**
**Location**: Always visible 384px panel on left side
**Logo**: Acuetic logo with gradient design at top

### **Navigation Categories** (Click to Expand/Collapse)

#### **1. INTELLIGENCE** (Blue Gradient - 6 modules)
- **Intelligence Command Center** (`/`) - Executive dashboard
- **Pulse Intelligence** (`/pulse`) - Organizational health metrics
- **Flux Adaptations** (`/flux`) - Change management intelligence  
- **Prism Insights** (`/prism`) - Multi-dimensional analysis
- **Echo Cultural Analytics** (`/echo`) - Team dynamics
- **Nova Innovations** (`/nova`) - Innovation pipeline

#### **2. CRISIS** (Red-Orange Gradient - 4 tools)
- **Crisis Response Center** (`/crisis`) - Emergency management
- **Scenario Templates** (`/templates`) - Crisis response templates
- **Triggers Management** (`/triggers-management`) - Real-time monitoring
- **Executive War Room** (`/war-room`) - Emergency command center

#### **3. STRATEGIC** (Teal Gradient - 8 tools)
- **Strategic Planning** (`/strategic`) - Scenario planning
- **Strategic Scenarios** (`/scenarios`) - Advanced planning
- **Enterprise Structure** (`/organizations`) - Org management
- **Advanced Analytics** (`/advanced-analytics`) - Predictive models
- **Executive Analytics** (`/executive-analytics-dashboard`) - C-suite analytics
- **Real-Time Collaboration** (`/real-time-collaboration`) - Team coordination
- **Executive Demo** (`/executive-demo`) - Client presentations

#### **4. SYSTEM** (Gray Gradient - 4 admin tools)
- **Integration Hub** (`/integration-hub`) - API management
- **Audit & Compliance** - Regulatory compliance
- **Settings & Preferences** - Platform configuration
- **User Management** - Access control

---

## DEMO SCENARIO WALKTHROUGHS

### **SCENARIO 1: Crisis Response Management**
*Primary Demo - "Supply Chain Crisis Recovery"*

#### **Step 1: Access Crisis Response Center**
**Navigation**: Sidebar → Crisis (red category) → "Crisis Response Center"
**URL**: `/crisis`
**User Sees**:
- Red-orange gradient header: "Crisis Response Command Center"
- Active crisis counter: "1 Active Crisis"
- Emergency alert banner highlighting active scenarios
- Crisis readiness metrics: "98% preparedness score"

#### **Step 2: Review Active Crisis**  
**Action**: Click on "Supply Chain Crisis" card
**User Sees**:
- **Title**: "Critical Supplier Bankruptcy: Q4 Delivery Pipeline at Risk"
- **Details**: Apex Components bankruptcy, $127M frozen orders, 16-week lead times
- **Impact**: $89M customer pre-orders at risk
- **"View Crisis Details"** button prominently displayed

#### **Step 3: Navigate to Crisis Management**
**Action**: Click "View Crisis Details"
**URL**: `/crisis/{crisis-id}` 
**User Sees**:
- Red gradient crisis header with organization context
- 4 horizontal tabs: **Overview | Tasks (4) | Timeline | Analysis**
- Quick actions panel with status controls

#### **Step 4: Task Management Demonstration**
**Location**: Click "Tasks" tab
**User Sees**:
- **4 Strategic Tasks** displayed:
  1. "Assess alternative suppliers" (HIGH priority)
  2. "Communicate disruption to customers" (HIGH priority)
  3. "Evaluate financial impact" (MEDIUM priority) 
  4. "Develop contingency plans" (MEDIUM priority)
- **Interactive checkboxes** for completion
- **Progress counter**: "0 of 4 completed"

#### **Step 5: Real-Time Task Updates**
**Action**: Check off first two tasks
**User Sees**:
- Tasks marked completed with checkmarks
- Progress updates to "2 of 4 completed"
- Success toast: "Task Updated"
- Changes reflect immediately without page refresh

#### **Step 6: Explore Additional Tabs**
**Timeline Tab**:
- Chronological crisis events
- "Crisis Detected" → "Response Activated" → "Crisis Resolved"
- Full timestamps and event descriptions

**Analysis Tab**:
- Response performance metrics with progress bars
- Key insights with executive summary points
- Performance badges: "Excellent", "Good", "Very Good"

---

### **SCENARIO 2: AI Intelligence Modules**
*Secondary Demo - "Strategic Decision Intelligence"*

#### **Step 7: Access AI Intelligence Dashboard**
**Navigation**: Sidebar → Intelligence (blue category) → "Intelligence Command Center"
**URL**: `/`
**User Sees**:
- **5 AI Modules** with distinctive branding:
  - **Pulse Intelligence** (emerald): Real-time health metrics
  - **Flux Adaptations** (blue-purple): Change strategies  
  - **Prism Insights** (multi-layer): Strategic analysis
  - **Echo Cultural Analytics** (purple-pink): Team dynamics
  - **Nova Innovations** (yellow-orange): Innovation pipeline
- Enhanced gradients and hover effects throughout

#### **Step 8: Explore Module-Specific Tabs**
**Pulse Intelligence** (`/pulse`):
- **Overview** - Health summary dashboard
- **Health Metrics** - Detailed organizational data
- **Trend Analysis** - Performance trends
- **AI Alerts** - Real-time notifications

**Nova Innovations** (`/nova`):
- **Discovery** - Early-stage opportunities
- **Ideation** - Concept development
- **Research** - Active research projects
- **Development** - Projects in development
- **All Projects** - Complete innovation portfolio

---

### **SCENARIO 3: Crisis Template Activation**
*Supporting Demo - "Emergency Response Capabilities"*

#### **Step 9: Emergency Template Activation**
**Action**: Return to Crisis Response Center (`/crisis`)
**User Sees**:
- Grid of crisis response templates
- Categories: Security, Supply Chain, Financial, Reputation
- Severity indicators: Catastrophic, Severe, Significant
- Response phases and escalation triggers

#### **Step 10: One-Click Emergency Activation**
**Action**: Click "Emergency Activation" on any template
**User Sees**:
- Immediate activation with timestamp
- Success notification: "Crisis Response Activated"
- New active crisis appears in dashboard
- Automatic protocol initiation demonstration

---

## TAB STRUCTURE GUIDE

### **Universal Tab Pattern**
All pages use the same tab component structure but with different content:

```
<Tabs defaultValue="[first-tab]">
  <TabsList> (horizontal tab navigation)
    <TabsTrigger> (individual tab buttons)
  <TabsContent> (tab content panels)
</Tabs>
```

### **Tab Layouts by Module**

#### **Crisis Detail Page**
| Tab | Content | Key Features |
|-----|---------|--------------|
| **Overview** | Crisis description, organization details | Full crisis context |
| **Tasks (X)** | Strategic action items with checkboxes | Real-time progress tracking |
| **Timeline** | Chronological event history | Crisis progression tracking |
| **Analysis** | Performance metrics and insights | Executive-level analytics |

#### **Pulse Intelligence**  
| Tab | Content | Key Features |
|-----|---------|--------------|
| **Overview** | Health summary dashboard | Key metrics overview |
| **Health Metrics** | Detailed organizational health data | Deep dive analytics |
| **Trend Analysis** | Performance trends over time | Historical patterns |
| **AI Alerts** | Real-time health notifications | Proactive alerts |

#### **Flux Adaptations**
| Tab | Content | Key Features |
|-----|---------|--------------|
| **Active Strategies** | Current adaptation initiatives | Live strategy tracking |
| **In Planning** | Strategies being developed | Pipeline visibility |
| **All Strategies** | Complete strategy overview | Full portfolio view |
| **Analytics** | Adaptation performance metrics | Strategy effectiveness |

#### **Nova Innovations**
| Tab | Content | Key Features |
|-----|---------|--------------|
| **Discovery** | Early-stage opportunities | Innovation pipeline entry |
| **Ideation** | Concept development projects | Idea development tracking |
| **Research** | Active research initiatives | R&D project status |
| **Development** | Projects in development | Active development projects |
| **All Projects** | Complete innovation portfolio | Full innovation overview |

---

## ACTIVITIES & DETAILS LOCATIONS

### **Activities Tracking**

#### **Global Activities**
**Component**: ActivityFeed (separate component)
**Location**: Embedded in various dashboards
**Features**:
- "Recent Activity" header
- User actions with timestamps
- Activity types: task completion, scenario creation, user actions
- "View All Activity" button

#### **Task-Specific Activities**  
**Location**: Within Crisis Detail → Tasks tab
**Features**:
- Real-time task completion updates
- Progress counter changes (e.g., "0 of 4" → "2 of 4")
- Success notifications on task updates
- Immediate visual feedback without page refresh

### **Details Locations**

#### **Crisis Details**
- **Overview Tab**: Complete crisis description and context
- **Organization Details**: Within Overview tab, separate card
- **Task Details**: Individual task cards with priority, due dates, descriptions
- **Timeline Details**: Full chronological event history
- **Analysis Details**: Performance metrics and executive insights

#### **Quick Access Details**
- **Crisis Status**: Top of crisis detail page header
- **Emergency Contacts**: Bottom of Crisis Response Center
- **Quick Actions**: Right sidebar on crisis detail pages

---

## TRAINING SCRIPTS

### **Executive Demo Opening** (2 minutes)
> "Welcome to Acuetic, the strategic intelligence platform that helps Fortune 500 organizations **See Clearer and Lead Bolder**. Today I'll demonstrate how Acuetic transforms your organization's ability to anticipate, respond to, and learn from strategic challenges through AI-driven intelligence and enterprise-grade crisis management."

### **Crisis Response Demo Script** (5 minutes)
> "Let me show you our Crisis Response Center in action. Here we have an active supply chain crisis - our primary semiconductor supplier has filed for bankruptcy, putting $127 million in orders at risk."

> **[Click Crisis Response Center]** "The platform immediately surfaces this as a critical situation requiring executive attention."

> **[Click View Crisis Details]** "Now we're in the crisis command center. Notice the four key areas: Overview for context, Tasks for action items, Timeline for tracking, and Analysis for insights."

> **[Click Tasks tab]** "The Tasks tab shows our strategic response plan - four critical actions prioritized by importance. Watch what happens when we complete tasks..." 

> **[Check off tasks]** "The progress updates in real-time - from 0 of 4 to 2 of 4 completed. This gives executives immediate visibility into response progress."

### **AI Intelligence Demo Script** (3 minutes)
> "Acuetic's AI Intelligence suite provides five complementary dimensions of organizational insight. Pulse Intelligence monitors your organizational health in real-time. Flux Adaptations identifies change management strategies. Prism Insights delivers multi-dimensional analysis. Echo Cultural Analytics assesses team dynamics. And Nova Innovations manages your innovation pipeline."

> **[Click Pulse Intelligence]** "Each module has specialized tabs for different aspects of analysis. For example, Pulse Intelligence offers Overview, Health Metrics, Trend Analysis, and AI Alerts - giving you complete visibility into organizational wellness."

### **Value Proposition Closing** (2 minutes)
> "What you've seen represents the difference between reactive and proactive leadership. Acuetic doesn't just help you respond to crises - it helps you anticipate them, prepare for them, and turn them into competitive advantages. The supply chain crisis we just managed? In traditional organizations, this could have taken weeks to coordinate. With Acuetic, we had visibility, coordination, and progress tracking in minutes."

---

## TROUBLESHOOTING GUIDE

### **Common Demo Issues**

#### **Navigation Problems**
- **Issue**: Sidebar categories not expanding
- **Solution**: Click directly on category headers (Intelligence, Crisis, Strategic, System)
- **Prevention**: Always wait for hover effects before clicking

#### **Tab Loading Issues**
- **Issue**: Tab content not displaying
- **Solution**: Refresh page and navigate back to specific tab
- **Prevention**: Ensure data is loaded before switching tabs quickly

#### **Task Update Problems**  
- **Issue**: Task checkboxes not responding
- **Solution**: Wait for any pending requests to complete before clicking
- **Prevention**: Don't rapid-click multiple tasks simultaneously

#### **Crisis Detail Access**
- **Issue**: "Crisis Not Found" error
- **Solution**: Ensure you're accessing valid crisis scenario IDs
- **Prevention**: Always use "View Crisis Details" buttons from crisis cards

### **Data Consistency**
- All demos use live database with realistic Fortune 500 scenarios
- Crisis scenarios include: Supply Chain Disruption, Market Disruption, Financial Liquidity Crisis
- Task counts and organization details are dynamically generated
- Progress tracking persists across browser sessions

### **Performance Optimization**
- Platform optimized for enterprise-grade performance
- Real-time updates without full page refreshes
- Responsive design works on tablets and large displays
- Professional loading states for all data operations

---

## DEMO SUCCESS METRICS

### **Executive Engagement Indicators**
- Questions about implementation timeline
- Interest in specific crisis scenarios relevant to their industry
- Requests for ROI calculations or case studies
- Discussion of integration with existing systems

### **Technical Validation Points**
- Recognition of enterprise-grade UI/UX quality
- Appreciation for real-time updates and responsiveness
- Understanding of scalability for large organizations
- Interest in security and compliance features

### **Next Steps Conversation Starters**
- "How would this integrate with our existing crisis management processes?"
- "What kind of training would our teams need?"
- "Can you show me how this would work with our organizational structure?"
- "What's the typical implementation timeline for organizations our size?"

---

## CONTACT & SUPPORT

For additional demo support, training materials, or technical questions:
- **Platform**: Acuetic Strategic Intelligence  
- **Demo Environment**: Fully functional with live data
- **Training Materials**: This guide provides complete walkthrough scripts
- **Technical Support**: Platform runs on enterprise-grade infrastructure

**Remember**: The goal is to demonstrate "See Clearer. Lead Bolder." - show executives how Acuetic provides the visibility and tools they need to lead with confidence in an uncertain world.

---

*Document Version 2.0 - Updated September 2025*  
*© 2025 Acuetic Strategic Intelligence Platform*