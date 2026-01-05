# 🎯 Bastion Demo - Quick Reference Card

**Print this. Keep it next to your laptop during demos.**

---

## 🚀 **Pre-Demo Checklist** (5 min before)

- [ ] Server running (`npm run dev`)
- [ ] Browser open to demo landing page
- [ ] Terminal/Postman ready for live API calls
- [ ] Sample event prepared for AI analysis
- [ ] Organization ID noted: `_______________`
- [ ] NEWS_API_KEY configured (optional)
- [ ] Backup screenshots ready (in case demo fails)

---

## 📡 **Essential API Endpoints**

### **Live AI Analysis (The Star of the Show)**
```bash
curl -X POST http://localhost:5000/api/intelligence/analyze-event \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "demo-org",
    "source": "Breaking News",
    "title": "[Event headline]",
    "content": "[Event details...]"
  }' | jq
```

### **Real-Time Intelligence**
```bash
curl http://localhost:5000/api/intelligence/real-time/demo-org
```

### **Preparedness Score**
```bash
curl http://localhost:5000/api/preparedness/real-score/demo-org
```

### **ROI Metrics**
```bash
curl http://localhost:5000/api/roi/real-metrics/demo-org
```

### **Generate Briefing**
```bash
curl -X POST http://localhost:5000/api/briefings/generate-daily \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "demo-org"}'
```

---

## 🎬 **Demo Flow - 3 Formats**

### **15-Min Investor Pitch**
1. **Problem** (2 min) - 72hr coordination → lost opportunities
2. **Demo** (5 min) - Dashboard, AI Radar, Playbooks  
3. **Live AI** (4 min) - Analyze real event, show results
4. **Vision** (2 min) - Category creation, $XM ask
5. **Close** (2 min) - Next steps

### **30-Min Customer Demo**
1. **Discovery** (5 min) - Their pain, calculate cost
2. **Demo** (8 min) - Relevant scenarios, capabilities
3. **Live with Their Data** (12 min) - Configure triggers, analyze industry event
4. **ROI** (5 min) - Calculate their value, implementation plan

### **20-Min Hybrid Demo**
1. **Demo Mode** (6 min) - Polished UI, full features
2. **Transition** (3 min) - "Is it real? Let me prove it..."
3. **Live AI** (7 min) - Real analysis, alert creation
4. **Close** (4 min) - Vision + proof = credibility

---

## 🎯 **Sample Events for Live AI**

**Use these if you can't find recent news:**

### **Competitive Threat**
```
Title: "Microsoft announces surprise $50B Salesforce acquisition"
Content: "In a stunning move, Microsoft announced plans to acquire Salesforce for $50 billion. Industry analysts predict immediate competitive responses from Oracle, SAP, and Google Cloud. The deal could trigger consolidation in the $50B enterprise software market."
```

### **Market Opportunity**
```
Title: "EU announces €100B digital infrastructure initiative"
Content: "European Union unveiled a €100 billion digital infrastructure program targeting AI, cloud computing, and enterprise software adoption. The initiative aims to reduce dependence on US tech giants and create opportunities for European software vendors. Applications open Q3 2025."
```

### **Regulatory Change**
```
Title: "SEC proposes new AI disclosure requirements for public companies"
Content: "Securities and Exchange Commission proposed mandatory AI risk disclosures for publicly traded companies. Requirements include AI system auditing, bias testing, and incident reporting. Compliance deadline: January 1, 2026. Affects 4,000+ companies."
```

### **Crisis/Risk**
```
Title: "Major cloud provider suffers 48-hour global outage"
Content: "Leading cloud infrastructure provider experienced catastrophic 48-hour outage affecting 300,000 businesses globally. Estimated economic impact: $5-8 billion. Companies scrambling to implement multi-cloud strategies to prevent single points of failure."
```

---

## 💬 **Key Talking Points**

### **When They Ask: "Is This Real?"**
> "Great question. The UI is high-fidelity by design—executives expect polish. But the AI behind it is 100% real. Let me prove it to you right now..." → **[Launch live demo]**

### **When They Ask: "What's Different from Slack/Teams?"**
> "Slack is for messages. We're for coordinated strategic execution. Think playbooks, not conversations. Decisions, not discussions."

### **When They Ask: "What's the ROI?"**
> "Let's calculate it together. [Executive count] × [hourly rate] × [hours saved] × [events per year] = $X million. And that's just time savings, not strategic value."

### **When They Ask: "How Long to Implement?"**
> "Design partner track: 2 weeks to first value, 90 days to full deployment. Enterprise track: 60 days full implementation with dedicated team."

### **When They Ask: "What About Security?"**
> "Enterprise-grade from day one: SOC2 track, role-based access, audit logging, encryption. Built for Fortune 1000 compliance. Happy to connect you with our security team."

---

## 🔧 **Troubleshooting**

### **If Live AI Fails:**
1. Check server logs: `curl http://localhost:5000/api/health`
2. Try simpler event (shorter content)
3. Show backup screenshots/video
4. Acknowledge: "This is beta—refining for 99.9% reliability"
5. Pivot: "The point is the AI works, we're polishing reliability"

### **If They Don't See Value:**
1. Go back to discovery
2. Ask: "What strategic decisions take too long?"
3. Find their specific pain point
4. Re-demo with their context

### **If They're Comparing to Competitors:**
1. Acknowledge the comparison
2. Differentiate on category: "Different space entirely"
3. Show unique capability: Live AI analysis
4. Quantify advantage: "Can they analyze events in 3 seconds?"

---

## 📊 **Value Calculation Cheat Sheet**

**Time Savings Formula:**
```
Hours Saved = (72 - 8) × Executives × Events/Year
Value = Hours Saved × Hourly Rate

Example:
64 hours × 30 people × 12 events = 23,040 hours
23,040 × $300/hr = $6.9M annual value
```

**ROI Ratio:**
```
Annual Value / Platform Cost = ROI Multiple

Example:
$6.9M / $300K = 23x ROI
```

---

## ✨ **Closing Lines**

### **For Investors:**
> "We're creating a new category—Executive Decision Operations. Salesforce did this for CRM. We're doing it for strategic execution. Who wants to command every decision with us?"

### **For Customers:**
> "You just saw the AI analyze a real event in 3 seconds and provide C-suite strategic intelligence. How much is that worth to your organization?"

### **For Skeptics:**
> "Most demos are smoke and mirrors. Today you saw both the vision AND the working technology. The AI is real. The value is real. The only question is: are you ready?"

---

## 📋 **Post-Demo Actions**

**Immediately after:**
- [ ] Send thank you email
- [ ] Share demo recording link (if permitted)
- [ ] Note their specific pain points
- [ ] Schedule follow-up call

**Within 24 hours:**
- [ ] Send formal proposal
- [ ] Include ROI calculation
- [ ] Attach technical docs
- [ ] Propose next steps

**Within 1 week:**
- [ ] Technical deep-dive (if needed)
- [ ] Security review (if needed)
- [ ] Contract discussion (if buying signal)

---

## 🎯 **Success Signals**

**You're winning if they:**
- ✅ Ask detailed technical questions
- ✅ Calculate their own ROI during demo
- ✅ Ask "When can we start?"
- ✅ Want to involve other stakeholders
- ✅ Request technical deep-dive

**You're losing if they:**
- ❌ Look bored or distracted
- ❌ Can't see how it applies to them
- ❌ Focus only on price
- ❌ Compare to unrelated tools
- ❌ Don't ask follow-up questions

---

## 💡 **Final Tips**

1. **Customize every demo** - Use their industry, their pain, their data
2. **Show AND prove** - Demo mode hooks, live mode converts
3. **Quantify everything** - ROI, time savings, business impact
4. **Handle objections confidently** - You've anticipated them
5. **Always be closing** - Every answer leads to next step

---

**Emergency Contact:** [Your contact info]  
**Tech Support:** [Support contact]  
**Demo Issues:** Run `./test-real-intelligence.sh` to verify system

---

**Remember:** You're not selling software. You're offering strategic transformation. Every Fortune 1000 company needs this—you're helping them realize it first. 🚀
