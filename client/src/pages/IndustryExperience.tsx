import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { scrollToTop } from '@/components/ScrollToTop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Crown, TrendingUp, Rocket, Shield, Pill, Factory, ShoppingCart, Zap,
  BookOpen, ArrowRight, ArrowLeft, Play, Brain, Radio, CheckCircle2,
  Clock, AlertTriangle, Globe, Building2, Lightbulb, MessageSquare,
  FileText, Eye, Layers, Plus, Sliders, Bell, BarChart3,
  Activity, Workflow, Award, Timer, Trash2, Users, DollarSign,
  Database, Target
} from 'lucide-react';

interface IndustryData {
  id: string;
  title: string;
  organization: string;
  industry: string;
  icon: any;
  color: string;
  gradient: string;
  scenario: string;
  domain: string;
  domainCategory: 'GROWTH' | 'RISK & RESILIENCE' | 'TRANSFORMATION';
  playbook: { number: string; name: string; tasks: number; stakeholders: number; budget: string };
  triggers: { name: string; source: string; type: string }[];
  dataSources: { name: string; status: string; dataPoints: number }[];
  customizations: { field: string; before: string; after: string }[];
  signal: { name: string; severity: string; source: string; detail: string };
  aiInsights: string[];
  stakeholders: { name: string; role: string; responseTime: string }[];
  executionTasks: { task: string; tool: string; status: string; time: string }[];
  outcomes: { metric: string; before: string; after: string }[];
  lesson: string;
}

const INDUSTRIES: Record<string, IndustryData> = {
  'lvmh-market-entry': {
    id: 'lvmh-market-entry', title: 'Strategic Market Entry', organization: 'LVMH Moët Hennessy Louis Vuitton',
    industry: 'Luxury Goods', icon: Crown, color: 'text-[#C9A84C]', gradient: 'from-[#0A0F2E] to-[#C9A84C]',
    scenario: 'China Luxury Renaissance — 10-Brand Simultaneous Launch Across 15 Cities',
    domain: 'Market Entry', domainCategory: 'GROWTH',
    playbook: { number: '145', name: 'Strategic Market Entry — Multi-Brand Launch', tasks: 42, stakeholders: 1267, budget: '€85M' },
    triggers: [
      { name: 'Government Trade Policy Change Detected', source: 'Reuters + Bloomberg Terminal', type: 'Automated Regulatory' },
      { name: 'Consumer Sentiment Surge — China Luxury Index', source: 'Bain & Company + McKinsey Data Feed', type: 'Automated Market Intelligence' },
      { name: 'CEO Strategic Activation — Board Approved Expansion', source: 'Executive Dashboard', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'Bloomberg Terminal — China Markets', status: 'Connected', dataPoints: 24000 },
      { name: 'Alibaba/JD.com Marketplace Analytics', status: 'Connected', dataPoints: 180000 },
      { name: 'WeChat/Douyin Social Intelligence', status: 'Connected', dataPoints: 450000 },
      { name: 'Bain Luxury Market Monitor', status: 'Connected', dataPoints: 3400 },
    ],
    customizations: [
      { field: 'Brand Launch Sequence', before: 'Alphabetical rollout', after: 'Revenue-optimized: Louis Vuitton + Dior (Week 1) → Fendi + Givenchy (Week 2) → Remaining 6 brands (Weeks 3-4)' },
      { field: 'Location Strategy', before: 'Tier 1 cities only', after: '15 cities across 3 tiers: Shanghai/Beijing/Shenzhen (flagship) → Chengdu/Hangzhou/Wuhan (premium) → 9 emerging luxury corridors' },
      { field: 'Digital Integration', before: 'Standard e-commerce', after: 'WeChat Mini Programs + Douyin Live Commerce + Tmall Luxury Pavilion + Red (Xiaohongshu) KOL activations per brand' },
      { field: 'VIP Client Strategy', before: 'Generic CRM outreach', after: '3-tier VIP program: Ultra-HNWI private viewings → HNWI invitation events → Aspirational digital-first experiences' },
    ],
    signal: { name: 'China Luxury Market Window Opening — Government Policy Shift + Consumer Confidence Surge', severity: 'CRITICAL', source: 'Bloomberg + Bain Luxury Index + WeChat Trend Data', detail: 'Chinese government announces new "Hainan Free Trade Port" expansion with zero-tariff luxury imports. Simultaneously, luxury consumer confidence index hits 3-year high at 87.4. McKinsey data shows 340M consumers ready to upgrade spending. Competitor Kering already mobilizing for Q2 launch — first-mover advantage window: 90 days.' },
    aiInsights: [
      'Competitive window: Kering mobilizing for Q2 — LVMH must launch within 90 days to capture first-mover advantage worth €480M',
      'Consumer data: 340M potential luxury consumers, 78% prefer omnichannel experiences with WeChat-first discovery',
      'Location optimization: AI recommends 47 retail locations across 15 cities based on foot traffic, competitor proximity, and demographic data',
      'Supply chain readiness: 8 of 10 brands have sufficient China-allocated inventory; Louis Vuitton and Dior need 30% inventory acceleration',
    ],
    stakeholders: [
      { name: 'Bernard Arnault', role: 'Chairman & CEO, LVMH', responseTime: '2 min 15 sec' },
      { name: 'Delphine Arnault', role: 'CEO, Christian Dior', responseTime: '1 min 42 sec' },
      { name: 'Pietro Beccari', role: 'CEO, Louis Vuitton', responseTime: '58 seconds' },
      { name: 'Serge Brunschwig', role: 'CEO, Fendi', responseTime: '1 min 30 sec' },
      { name: 'Andrew Wu', role: 'President, LVMH Greater China', responseTime: '34 seconds' },
      { name: 'Jean-Jacques Guiony', role: 'CFO, LVMH Group', responseTime: '3 min 5 sec' },
    ],
    executionTasks: [
      { task: 'Multi-brand launch prepared response activated across 10 brand CEOs', tool: 'Microsoft Teams + Slack', status: 'Complete', time: '0:30' },
      { task: '47 retail location lease negotiations initiated simultaneously', tool: 'Salesforce + DocuSign', status: 'Complete', time: '1:00' },
      { task: 'WeChat Mini Programs configured for all 10 brands', tool: 'Tencent API + Custom', status: 'Complete', time: '1:30' },
      { task: 'KOL partnerships activated — 200 influencers across Douyin/Red', tool: 'Influencer Platform + Sprout Social', status: 'Complete', time: '2:30' },
      { task: 'Supply chain acceleration orders placed for LV and Dior', tool: 'SAP + Oracle SCM', status: 'Complete', time: '3:30' },
      { task: 'VIP client database segmented — 12,000 Ultra-HNWI invitations staged', tool: 'Salesforce + HubSpot', status: 'Complete', time: '5:00' },
      { task: 'Regulatory compliance filings submitted across 15 cities', tool: 'ServiceNow + Legal', status: 'Complete', time: '7:00' },
      { task: 'PR campaign with 50 media outlets synchronized for launch day', tool: 'PR Newswire + Cision', status: 'Complete', time: '9:00' },
      { task: '1,267 stakeholders coordinated, 10-brand launch program fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Full Launch Coordination', before: '6-9 months', after: '11 minutes 47 seconds' },
      { metric: 'Brands Launched Simultaneously', before: '1-2 sequential', after: '10 brands, 15 cities, 47 locations' },
      { metric: 'First-Mover Revenue Captured', before: 'Unknown', after: '€1.68B projected Year 1' },
      { metric: 'Competitive Advantage', before: 'React to competitors', after: '90-day head start vs. Kering' },
    ],
    lesson: 'Prepared Response enhanced: Added "Government Policy Monitor" as a leading indicator trigger — detected tariff changes 45 days before public announcement. Created reusable "Multi-Brand Simultaneous Launch" template. WeChat-first digital strategy outperformed traditional retail-first by 340%.',
  },
  'shein-trend': {
    id: 'shein-trend', title: 'Viral Trend Capitalization', organization: 'SHEIN (Global Fashion Marketplace)',
    industry: 'Fast Fashion', icon: TrendingUp, color: 'text-[#C9A84C]', gradient: 'from-[#0A0F2E] to-[#0A0F2E]',
    scenario: 'TikTok Cottage Core Trend — 200 SKUs Designed, Manufactured & Listed in 7 Days',
    domain: 'Product Launch', domainCategory: 'GROWTH',
    playbook: { number: '146', name: 'Trend Capitalization — Viral Response', tasks: 38, stakeholders: 5847, budget: '$2.4M' },
    triggers: [
      { name: 'TikTok Hashtag Velocity Spike', source: 'TikTok Creator API + Brandwatch', type: 'Automated Social Intelligence' },
      { name: 'Google Trends Breakout Detection', source: 'Google Trends API', type: 'Automated Search Intelligence' },
      { name: 'Competitor Fast-Follow Alert', source: 'Competitor Monitor + Web Scraping', type: 'Automated Competitive' },
    ],
    dataSources: [
      { name: 'TikTok Creator Analytics', status: 'Connected', dataPoints: 890000 },
      { name: 'Google Trends Real-Time', status: 'Connected', dataPoints: 45000 },
      { name: 'SHEIN Internal Design Engine', status: 'Connected', dataPoints: 12000 },
      { name: 'Supplier Network Dashboard', status: 'Connected', dataPoints: 34000 },
    ],
    customizations: [
      { field: 'Trend Response Speed', before: '14-day design-to-listing', after: '7-day sprint: Day 1-2 Design AI → Day 3-4 Sampling → Day 5-6 Production → Day 7 Live Listing' },
      { field: 'SKU Volume', before: '50 SKUs per trend', after: '200 SKUs: 80 core items + 60 accessories + 40 plus-size + 20 premium tier' },
      { field: 'Influencer Activation', before: 'Post-launch seeding', after: 'Pre-launch: 500 micro-influencers seeded Day 5, 50 macro-influencers Day 7, 5 mega-influencers Day 8' },
      { field: 'Pricing Strategy', before: 'Standard markup', after: 'Dynamic: $8-15 core, $15-25 premium, flash sale at 48h for viral acceleration' },
    ],
    signal: { name: 'Cottage Core Mega-Trend Detected — 47M Views in 72 Hours, Accelerating', severity: 'CRITICAL', source: 'TikTok API + Google Trends Breakout', detail: '#CottageCore hashtag hit 47M views in 72 hours with 340% acceleration rate. Google Trends shows "cottage core dress" and "prairie style" at breakout level across US, UK, and Australia. Competitor Zara detected sourcing similar fabrics — 10-day estimated lead. Revenue opportunity: $180M if captured in first 14 days.' },
    aiInsights: [
      'Trend velocity analysis: 47M views with 340% acceleration — projected to reach 200M views within 10 days',
      'Competitive intelligence: Zara sourcing linen/muslin fabrics, estimated 10-day lead — SHEIN must launch in 7 days to capture first-mover',
      'Design AI recommendation: 200 SKU assortment across 4 sub-trends (prairie dress, puff sleeve, floral midi, cottage accessories)',
      'Supplier network: 12 Guangzhou manufacturers have immediate capacity for 500K units; fabric pre-positioning needed within 24 hours',
    ],
    stakeholders: [
      { name: 'Chris Xu', role: 'Founder & CEO', responseTime: '1 min 45 sec' },
      { name: 'Molly Miao', role: 'Chief Design Officer', responseTime: '32 seconds' },
      { name: 'Leonard Lin', role: 'VP Supply Chain', responseTime: '48 seconds' },
      { name: 'Jessica Wang', role: 'Head of Social Commerce', responseTime: '28 seconds' },
      { name: 'Peter Chen', role: 'VP Marketplace Operations', responseTime: '1 min 12 sec' },
      { name: 'Sarah Kim', role: 'Global Marketing Director', responseTime: '1 min 30 sec' },
    ],
    executionTasks: [
      { task: 'Design AI generates 200 SKU concepts from trend data', tool: 'SHEIN Design Engine + Midjourney', status: 'Complete', time: '0:30' },
      { task: '12 manufacturers activated with fabric pre-orders', tool: 'Supplier Portal + SAP', status: 'Complete', time: '1:00' },
      { task: 'Trend brief distributed to 5,847 supply chain stakeholders', tool: 'Slack + WeChat Work', status: 'Complete', time: '1:30' },
      { task: '500 micro-influencer seeding packages prepared', tool: 'Influencer Platform', status: 'Complete', time: '2:30' },
      { task: 'Dynamic pricing models configured for 4-tier strategy', tool: 'Pricing Engine', status: 'Complete', time: '3:30' },
      { task: 'Product listing templates pre-staged for Day 7 launch', tool: 'SHEIN Marketplace CMS', status: 'Complete', time: '5:00' },
      { task: 'TikTok ad campaigns pre-built with trend-matched creative', tool: 'TikTok Ads Manager', status: 'Complete', time: '7:00' },
      { task: '5,847 stakeholders synchronized, 7-day sprint activated', tool: 'Readiness OS', status: 'Complete', time: '11:22' },
    ],
    outcomes: [
      { metric: 'Time to Trend Response Activation', before: '48-72 hours', after: '11 minutes 22 seconds' },
      { metric: 'SKUs to Market', before: '50 in 14 days', after: '200 in 7 days' },
      { metric: 'Revenue Captured', before: '$40M (late entry)', after: '$108M (first-mover)' },
      { metric: 'Supply Chain Coordination', before: '3-5 days manual', after: '5,847 stakeholders aligned instantly' },
    ],
    lesson: 'Prepared Response enhanced: Added "TikTok Velocity Acceleration Rate" as a predictive trigger — identifies mega-trends 48 hours earlier than view count alone. Created reusable "7-Day Sprint" template for all future trend responses. Plus-size inclusion (40 SKUs) generated 28% of total revenue, now mandatory in all trend playbooks.',
  },
  'spacex-launch': {
    id: 'spacex-launch', title: 'Launch Schedule Acceleration', organization: 'SpaceX (Space Transportation)',
    industry: 'Aerospace', icon: Rocket, color: 'text-[#C9A84C]', gradient: 'from-[#0A0F2E] to-[#2B8A6E]',
    scenario: 'Optimal Orbital Window — Accelerating Starlink Launch by 3 Days',
    domain: 'Product Launch', domainCategory: 'GROWTH',
    playbook: { number: '155', name: 'Launch Acceleration Protocol', tasks: 45, stakeholders: 1847, budget: '$12M' },
    triggers: [
      { name: 'Orbital Mechanics Window Alert', source: 'Mission Control + AGI STK', type: 'Automated Orbital Analysis' },
      { name: 'Weather Window Optimization', source: 'NOAA + SpaceX Meteorology', type: 'Automated Environmental' },
      { name: 'Vehicle Readiness Threshold Met', source: 'Launch Operations + Telemetry', type: 'Automated Technical Readiness' },
    ],
    dataSources: [
      { name: 'Mission Control Telemetry', status: 'Connected', dataPoints: 2400000 },
      { name: 'AGI STK Orbital Simulator', status: 'Connected', dataPoints: 890000 },
      { name: 'NOAA Weather Systems', status: 'Connected', dataPoints: 45000 },
      { name: 'Range Safety Systems', status: 'Connected', dataPoints: 12000 },
    ],
    customizations: [
      { field: 'Launch Timeline', before: 'Standard T-72h countdown', after: 'Accelerated T-48h: compressed hold-fire reviews, parallel system checks, pre-positioned range assets' },
      { field: 'Payload Configuration', before: 'Standard 22-satellite stack', after: '23 satellites with optimized deployment sequence for orbital plane geometry' },
      { field: 'Recovery Operations', before: 'Standard ASDS positioning', after: 'Pre-positioned drone ship "Of Course I Still Love You" with backup "Just Read the Instructions" on standby' },
      { field: 'Regulatory Coordination', before: 'Sequential FAA/FCC filing', after: 'Parallel filing: FAA launch license amendment + FCC spectrum allocation + NOTAM + maritime closure simultaneously' },
    ],
    signal: { name: 'Optimal Orbital Window Detected — 23% Better Geometry, Closing in 72 Hours', severity: 'CRITICAL', source: 'AGI STK + Mission Control + NOAA', detail: 'Orbital analysis identifies a window in 72 hours with 23% improved geometry for Starlink shell 4 deployment. This window enables single-launch coverage of 340 ground stations vs. 2 launches required in the planned window. Weather probability: 85% favorable. Competitor OneWeb has a conflicting launch 96 hours later — SpaceX launch secures orbital priority.' },
    aiInsights: [
      'Orbital geometry analysis: 72-hour window enables single-launch coverage of 340 ground stations (saving $47M second launch cost)',
      'Vehicle readiness: Falcon 9 B1078 has 98.7% system readiness — 3 minor items can be cleared in parallel during accelerated countdown',
      'Competitive factor: OneWeb launch in 96 hours targets adjacent orbital slots — SpaceX launch secures spectrum priority under ITU first-come rules',
      'Weather: 85% probability favorable at T-0, improving to 92% by launch morning. Backup window 4 hours later at 78%',
    ],
    stakeholders: [
      { name: 'Gwynne Shotwell', role: 'President & COO', responseTime: '42 seconds' },
      { name: 'Bill Gerstenmaier', role: 'VP Build & Flight Reliability', responseTime: '38 seconds' },
      { name: 'Mark Juncosa', role: 'VP Vehicle Engineering', responseTime: '55 seconds' },
      { name: 'Sara Walker', role: 'Director, Dragon Mission Management', responseTime: '1 min 12 sec' },
      { name: 'Jonathan Hofeller', role: 'VP Starlink Commercial', responseTime: '1 min 45 sec' },
      { name: 'Lars Blackmore', role: 'Principal Engineer, Landing', responseTime: '32 seconds' },
    ],
    executionTasks: [
      { task: 'Accelerated countdown timeline activated — T-48h initiated', tool: 'Mission Control Systems', status: 'Complete', time: '0:30' },
      { task: 'FAA launch license amendment filed (expedited)', tool: 'FAA STARS + Legal', status: 'Complete', time: '1:00' },
      { task: '23-satellite stack deployment sequence optimized', tool: 'AGI STK + Custom Sim', status: 'Complete', time: '1:30' },
      { task: 'Drone ship OCISLY repositioned to optimal recovery zone', tool: 'Maritime Operations', status: 'Complete', time: '2:30' },
      { task: 'Range safety coordination with Cape Canaveral SFS', tool: 'US Space Force + FAA', status: 'Complete', time: '3:30' },
      { task: 'Propellant loading timeline advanced — LOX/RP-1 delivery confirmed', tool: 'Ground Systems', status: 'Complete', time: '5:00' },
      { task: 'Customer notification — Starlink service activation accelerated', tool: 'Salesforce + Email', status: 'Complete', time: '7:00' },
      { task: 'FCC spectrum filing for accelerated orbital deployment', tool: 'FCC ULS + Legal', status: 'Complete', time: '9:00' },
      { task: '1,847 stakeholders coordinated, launch acceleration fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:33' },
    ],
    outcomes: [
      { metric: 'Time to Launch Coordination', before: '5-7 days', after: '11 minutes 33 seconds' },
      { metric: 'Orbital Optimization', before: '2 launches needed', after: '1 launch, 23% better geometry' },
      { metric: 'Revenue Impact', before: 'Standard timeline', after: '$47M saved + strategic orbital priority' },
      { metric: 'Competitive Position', before: 'React to OneWeb', after: 'Secured ITU spectrum priority' },
    ],
    lesson: 'Prepared Response refined: Added "Orbital Window Prediction" as a 7-day lookahead trigger — identifies acceleration opportunities 5 days earlier. Created reusable "Accelerated Countdown" template with parallel regulatory filing. Recovery ship pre-positioning reduced booster turnaround by 2 days.',
  },
  'financial-ransomware': {
    id: 'financial-ransomware', title: 'Ransomware Attack Response', organization: 'LoanDepot (Major Mortgage Lender)',
    industry: 'Financial Services', icon: Shield, color: 'text-[#C9A84C]', gradient: 'from-[#0A0F2E] to-[#0A0F2E]',
    scenario: 'Banking Infrastructure Breach — LockBit 3.0 Attack on Mortgage Processing Systems',
    domain: 'Cybersecurity Incident', domainCategory: 'RISK & RESILIENCE',
    playbook: { number: '065', name: 'Ransomware Attack Response — Financial Services', tasks: 36, stakeholders: 150, budget: '$4.8M' },
    triggers: [
      { name: 'Anomalous Encryption on Mortgage Processing Servers', source: 'CrowdStrike + AWS GuardDuty', type: 'Automated Threat Detection' },
      { name: 'SWIFT Network Anomaly Detected', source: 'SWIFT GPI + Internal Monitor', type: 'Automated Financial Security' },
      { name: 'SOC Tier 3 Escalation — Active Threat Confirmed', source: 'Splunk SIEM + PagerDuty', type: 'Automated Security' },
    ],
    dataSources: [
      { name: 'CrowdStrike Falcon XDR', status: 'Connected', dataPoints: 89000 },
      { name: 'Splunk Enterprise Security', status: 'Connected', dataPoints: 450000 },
      { name: 'AWS GuardDuty + CloudTrail', status: 'Connected', dataPoints: 234000 },
      { name: 'SWIFT GPI Monitor', status: 'Connected', dataPoints: 12000 },
    ],
    customizations: [
      { field: 'Containment Protocol', before: 'Manual isolation approval', after: 'Auto-isolate: mortgage processing network within 30 seconds, SWIFT connections within 60 seconds, customer portal within 90 seconds' },
      { field: 'Regulatory Notification', before: 'Standard 72-hour window', after: 'Accelerated: SEC 8-K within 4 hours, state AG notification within 8 hours, CFPB within 12 hours, borrower notification within 24 hours' },
      { field: 'Customer Communication', before: 'Generic breach notice', after: '4-tier: Active borrowers (phone + email), pipeline applicants (email + portal), partners (dedicated line), media (holding statement)' },
      { field: 'Recovery Priority', before: 'All systems equal', after: 'Tiered: SWIFT/payment processing → Loan origination → Customer portal → Internal systems' },
    ],
    signal: { name: 'Active Ransomware — LockBit 3.0 Encrypting Mortgage Processing Servers', severity: 'CRITICAL', source: 'CrowdStrike Falcon + Splunk SIEM + AWS GuardDuty', detail: 'LockBit 3.0 variant detected encrypting production mortgage processing servers at 2:17 AM EST. 47 servers compromised across loan origination, servicing, and document management systems. 2M active borrowers potentially affected. SWIFT connections showing anomalous query patterns. Ransom note demands $15M in Bitcoin. Estimated business impact: $2.1M per hour of downtime.' },
    aiInsights: [
      'Attack vector: compromised third-party vendor credentials via supply chain attack on document management provider',
      'Lateral movement: 47 servers across 3 network segments — SWIFT payment systems NOT yet compromised but lateral path detected',
      'Data exposure assessment: 2M borrower records (SSN, financial data) potentially accessible — triggers federal/state notification requirements',
      'Recovery timeline: clean backups verified from 4 hours prior — full restoration possible within 18 hours if containment holds',
    ],
    stakeholders: [
      { name: 'Frank Martell', role: 'President & CEO', responseTime: '1 min 5 sec' },
      { name: 'Patrick Flanagan', role: 'CFO', responseTime: '1 min 42 sec' },
      { name: 'David Hayes', role: 'CISO', responseTime: '22 seconds' },
      { name: 'Nicole Beardsley', role: 'Chief Legal Officer', responseTime: '1 min 58 sec' },
      { name: 'Jeff Walsh', role: 'COO', responseTime: '2 min 15 sec' },
      { name: 'Maria Rodriguez', role: 'VP Customer Operations', responseTime: '1 min 30 sec' },
    ],
    executionTasks: [
      { task: 'Mortgage processing network isolated — all 47 servers quarantined', tool: 'CrowdStrike + AWS', status: 'Complete', time: '0:30' },
      { task: 'SWIFT connections severed — payment processing protected', tool: 'SWIFT GPI + Firewall', status: 'Complete', time: '0:45' },
      { task: 'Incident war room established with FBI Cyber Division liaison', tool: 'Zoom + Slack', status: 'Complete', time: '1:15' },
      { task: 'Forensics team engaged — CrowdStrike IR retainer activated', tool: 'CrowdStrike Services', status: 'Complete', time: '2:00' },
      { task: 'SEC 8-K material event filing prepared', tool: 'EDGAR + Legal', status: 'Complete', time: '3:00' },
      { task: 'Borrower communication — 2M notification emails staged', tool: 'Salesforce + SendGrid', status: 'Complete', time: '4:30' },
      { task: 'Backup integrity verified — 4-hour RPO restoration initiated', tool: 'Veeam + AWS S3', status: 'Complete', time: '6:00' },
      { task: 'Insurance carrier notified — $50M cyber policy activated', tool: 'Email + DocuSign', status: 'Complete', time: '8:00' },
      { task: '150 stakeholders coordinated, response fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Containment', before: '72 hours', after: '30 seconds (auto-isolation)' },
      { metric: 'SWIFT Payment Protection', before: 'Unknown exposure', after: 'Zero unauthorized transactions' },
      { metric: 'Regulatory Compliance', before: 'Scramble at deadline', after: 'SEC filing within 4 hours' },
      { metric: 'Financial Impact Avoided', before: '$22M+ in costs', after: '$22M avoided + $50M insurance activated' },
    ],
    lesson: 'Prepared Response enhanced: Added "Third-Party Vendor Access Monitor" as a leading indicator — would have detected the compromised vendor credentials 72 hours earlier. SWIFT auto-disconnect reduced payment exposure from potential $400M to zero. Created reusable "Financial Services Ransomware" template with built-in regulatory filing timelines.',
  },
  'pharma-recall': {
    id: 'pharma-recall', title: 'Product Recall — Class I', organization: 'Glenmark Pharmaceuticals',
    industry: 'Pharmaceutical', icon: Pill, color: 'text-[#0A0F2E]', gradient: 'from-[#0A0F2E] to-[#0A0F2E]',
    scenario: 'Class I Recall — Life-Threatening Contamination in Blood Pressure Medication',
    domain: 'Crisis Management', domainCategory: 'RISK & RESILIENCE',
    playbook: { number: '095', name: 'Product Recall — Class I (Life-Threatening)', tasks: 44, stakeholders: 2052, budget: '$8.5M' },
    triggers: [
      { name: 'FDA Adverse Event Report Cluster', source: 'FDA FAERS Database + Internal QA', type: 'Automated Regulatory' },
      { name: 'Quality Lab Deviation — Out-of-Specification Result', source: 'LIMS + Quality Management System', type: 'Automated Quality Control' },
      { name: 'Medical Affairs Escalation — Patient Safety Signal', source: 'Pharmacovigilance System', type: 'Automated Safety' },
    ],
    dataSources: [
      { name: 'FDA FAERS (Adverse Events)', status: 'Connected', dataPoints: 34000 },
      { name: 'SAP Quality Management', status: 'Connected', dataPoints: 89000 },
      { name: 'TraceLink Supply Chain', status: 'Connected', dataPoints: 450000 },
      { name: 'Pharmacovigilance Database', status: 'Connected', dataPoints: 12000 },
    ],
    customizations: [
      { field: 'Recall Scope', before: 'Single lot recall', after: 'Multi-lot: 47M units across 23 lot numbers, 3 dosage strengths, 2 manufacturing sites' },
      { field: 'Distribution Tracking', before: 'Wholesale level only', after: 'Full serialization: manufacturer → distributor → pharmacy → patient-level tracking via TraceLink' },
      { field: 'Patient Communication', before: 'Press release only', after: 'Multi-channel: pharmacy alerts, prescriber notifications, patient helpline (24/7), FDA MedWatch coordination, social media monitoring' },
      { field: 'Replacement Supply', before: 'Wait for production', after: 'Dual strategy: therapeutic alternatives from partner manufacturers + accelerated GMP production of replacement lots' },
    ],
    signal: { name: 'Class I Recall Required — NDMA Contamination Detected Above Safe Limits', severity: 'CRITICAL', source: 'FDA FAERS + Internal QA Lab + Pharmacovigilance', detail: 'NDMA (N-Nitrosodimethylamine), a probable human carcinogen, detected at 9.4 ppm in Losartan Potassium tablets — 94x above FDA acceptable intake limit of 0.1 ppm. 47M units distributed across 50 states, 3 territories, and 12 countries. 14 adverse event reports received in past 72 hours. FDA classification: Class I — reasonable probability of serious adverse health consequences or death.' },
    aiInsights: [
      'Patient exposure analysis: estimated 50M+ patients may have consumed affected lots over past 6 months — immediate physician notification critical',
      'Root cause preliminary: NDMA formation likely during synthesis of Losartan API at Indore manufacturing facility — process change 8 months ago correlates',
      'Supply chain impact: 23 lot numbers, distributed through 340 wholesalers to 45,000+ pharmacies — full TraceLink serialization enables pharmacy-level recall',
      'Regulatory timeline: FDA expects firm-initiated recall within 24 hours, public notification within 48 hours, effectiveness checks within 30 days',
    ],
    stakeholders: [
      { name: 'Glenn Saldanha', role: 'Chairman & MD', responseTime: '1 min 12 sec' },
      { name: 'Dr. Yasir Rawjee', role: 'Chief Scientific Officer', responseTime: '38 seconds' },
      { name: 'Robert Matsuk', role: 'President, North America', responseTime: '52 seconds' },
      { name: 'Dr. Sanjay Sharma', role: 'VP Quality & Regulatory', responseTime: '28 seconds' },
      { name: 'Cherylann Chow', role: 'VP Legal & Compliance', responseTime: '1 min 45 sec' },
      { name: 'Dr. Amit Sinha', role: 'Head of Pharmacovigilance', responseTime: '32 seconds' },
    ],
    executionTasks: [
      { task: 'FDA Class I recall notification prepared and filed', tool: 'FDA RES + Legal', status: 'Complete', time: '0:30' },
      { task: 'TraceLink serialization data pulled — 47M units mapped to 45,000 pharmacies', tool: 'TraceLink + SAP', status: 'Complete', time: '1:00' },
      { task: 'Pharmacy chain alerts sent to CVS, Walgreens, Walmart, Rite Aid', tool: 'EDI + Email', status: 'Complete', time: '1:30' },
      { task: 'Prescriber notification to 120,000 physicians via medical affairs', tool: 'Veeva CRM + Email', status: 'Complete', time: '2:30' },
      { task: 'Patient helpline activated — 200 agents, 24/7 coverage, 12 languages', tool: 'Genesys Cloud + Salesforce', status: 'Complete', time: '3:30' },
      { task: 'Therapeutic alternative sourcing from 3 partner manufacturers', tool: 'SAP + Procurement', status: 'Complete', time: '5:00' },
      { task: 'Manufacturing root cause investigation initiated at Indore facility', tool: 'SAP QM + LIMS', status: 'Complete', time: '7:00' },
      { task: 'Investor relations and SEC disclosure prepared', tool: 'EDGAR + IR Platform', status: 'Complete', time: '9:00' },
      { task: '2,052 stakeholders coordinated, recall operation fully activated', tool: 'Readiness OS', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Recall Initiation', before: '6 weeks', after: '11 minutes 47 seconds' },
      { metric: 'Pharmacy Notification', before: '2-3 weeks', after: '90 minutes to 45,000 pharmacies' },
      { metric: 'Patient Safety', before: 'Continued exposure for weeks', after: 'Same-day prescriber + pharmacy alerts' },
      { metric: 'Liability Avoided', before: 'Unknown', after: '$50M+ in litigation exposure reduced' },
    ],
    lesson: 'Prepared Response enhanced: Added "API Process Change Monitor" as a root cause prevention trigger — would have detected the synthesis modification 8 months earlier. TraceLink serialization enabled unprecedented pharmacy-level recall precision. Created reusable "NDMA Contamination Response" template now shared across industry consortium.',
  },
  'manufacturing-supplier': {
    id: 'manufacturing-supplier', title: 'Supplier Crisis Response', organization: 'Toyota Motor Corporation',
    industry: 'Manufacturing', icon: Factory, color: 'text-orange-400', gradient: 'from-orange-600 to-amber-800',
    scenario: 'Critical Semiconductor Shortage — 3 Assembly Plants at Risk of Shutdown',
    domain: 'Crisis Management', domainCategory: 'RISK & RESILIENCE',
    playbook: { number: '019', name: 'Supplier Failure Response — Critical Component', tasks: 40, stakeholders: 158, budget: '$45M' },
    triggers: [
      { name: 'Tier 1 Supplier Force Majeure Declaration', source: 'Supplier Portal + EDI', type: 'Automated Supply Chain' },
      { name: 'Inventory Buffer Threshold Breach', source: 'SAP MM + IoT Sensors', type: 'Automated Inventory' },
      { name: 'Production Schedule Conflict Alert', source: 'Toyota Production System + MES', type: 'Automated Manufacturing' },
    ],
    dataSources: [
      { name: 'Toyota Production System (TPS)', status: 'Connected', dataPoints: 890000 },
      { name: 'SAP Materials Management', status: 'Connected', dataPoints: 234000 },
      { name: 'Supplier Risk Dashboard', status: 'Connected', dataPoints: 45000 },
      { name: 'Global Logistics Network', status: 'Connected', dataPoints: 120000 },
    ],
    customizations: [
      { field: 'Production Rebalancing', before: 'Plant-by-plant adjustment', after: 'Global rebalancing: prioritize high-margin vehicles (Land Cruiser, Lexus), defer low-margin models, redistribute chips across 14 plants' },
      { field: 'Supplier Alternatives', before: 'Single backup source', after: 'Triple sourcing: TSMC emergency allocation + Samsung foundry qualification + Infineon substitute parts (12-week qualification sprint)' },
      { field: 'Customer Impact Management', before: 'Delay notification only', after: 'Proactive: dealer allocation adjustment, customer wait-time updates, build-to-order incentives, alternative model recommendations' },
      { field: 'Financial Hedging', before: 'Absorb cost increase', after: 'Multi-strategy: spot market procurement + futures contracts + supplier cost-sharing agreements + insurance claims' },
    ],
    signal: { name: 'Critical Semiconductor Shortage — Renesas Factory Fire Cuts Supply by 30%', severity: 'CRITICAL', source: 'Supplier Portal + TPS Inventory Alert', detail: 'Renesas Electronics Naka factory (supplies 30% of Toyota automotive MCUs) suffered major fire. Production halt expected 3-4 months. Immediate impact: 3 assembly plants have <5 days semiconductor inventory. 340,000 vehicles in production pipeline affected. Industry-wide shortage expected to remove 1.2M vehicles from global production.' },
    aiInsights: [
      'Inventory analysis: Georgetown KY (3 days), Tsutsumi Japan (4 days), Takaoka Japan (5 days) — all below 7-day minimum buffer',
      'Alternative sourcing: TSMC can provide 40% of needed MCUs in 6 weeks with expedited wafer starts; Samsung has 25% capacity available',
      'Production optimization: rebalancing across 14 plants can maintain 78% output by prioritizing high-margin models (saves $450M vs. full shutdown)',
      'Historical pattern: 2011 Renesas fire took 3 months recovery — current fire is smaller, estimate 2-month partial recovery if clean room intact',
    ],
    stakeholders: [
      { name: 'Koji Sato', role: 'President & CEO', responseTime: '1 min 30 sec' },
      { name: 'Kazunari Kumakura', role: 'Chief Procurement Officer', responseTime: '28 seconds' },
      { name: 'Masahiko Maeda', role: 'CTO', responseTime: '42 seconds' },
      { name: 'Yoichi Miyazaki', role: 'CFO', responseTime: '2 min 5 sec' },
      { name: 'Jim Lentz', role: 'CEO, Toyota North America', responseTime: '1 min 12 sec' },
      { name: 'Simon Humphries', role: 'Chief Design Officer', responseTime: '2 min 45 sec' },
    ],
    executionTasks: [
      { task: 'Global semiconductor inventory audit across 14 plants completed', tool: 'SAP MM + TPS', status: 'Complete', time: '0:30' },
      { task: 'Emergency procurement team activated — TSMC/Samsung contacted', tool: 'Procurement Portal', status: 'Complete', time: '1:00' },
      { task: 'Production rebalancing algorithm deployed — 78% output plan approved', tool: 'TPS + MES', status: 'Complete', time: '1:30' },
      { task: 'Georgetown KY plant shifted to high-margin models only', tool: 'MES + SAP PP', status: 'Complete', time: '2:30' },
      { task: 'Dealer network allocation adjustments communicated', tool: 'Dealer Portal + Email', status: 'Complete', time: '3:30' },
      { task: 'Infineon substitute MCU qualification fast-tracked (12-week sprint)', tool: 'PLM + Quality Lab', status: 'Complete', time: '5:00' },
      { task: 'Insurance claim filed — business interruption coverage activated', tool: 'Risk Management', status: 'Complete', time: '7:00' },
      { task: 'Renesas recovery support team dispatched (30 Toyota engineers)', tool: 'HR + Travel', status: 'Complete', time: '9:00' },
      { task: '158 stakeholders coordinated, crisis response fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:12' },
    ],
    outcomes: [
      { metric: 'Time to Crisis Response', before: '30 days', after: '11 minutes 12 seconds' },
      { metric: 'Production Maintained', before: '50% shutdown', after: '78% output maintained' },
      { metric: 'Revenue Protected', before: '$1.2B at risk', after: '$450M production saved' },
      { metric: 'Recovery Acceleration', before: '3-4 months', after: '2 months (Toyota engineers on-site)' },
    ],
    lesson: 'Prepared Response enhanced: Added "Tier 1 Supplier Facility Risk Score" as a predictive trigger — monitors fire safety ratings, geographic risk, and single-source dependencies. Created reusable "Semiconductor Shortage Response" template. Toyota engineer deployment to supplier recovery is now standard protocol.',
  },
  'retail-contamination': {
    id: 'retail-contamination', title: 'Food Contamination Response', organization: 'Walmart Inc.',
    industry: 'Retail', icon: ShoppingCart, color: 'text-[#2B8A6E]', gradient: 'from-[#2B8A6E] to-[#0A0F2E]',
    scenario: 'Salmonella Contamination — 847 Stores, 23 States, 12,847 Customers Affected',
    domain: 'Crisis Management', domainCategory: 'RISK & RESILIENCE',
    playbook: { number: '095', name: 'Food Product Recall — Contamination Response', tasks: 42, stakeholders: 5000, budget: '$12M' },
    triggers: [
      { name: 'CDC Outbreak Investigation Alert', source: 'CDC PulseNet + State Health Depts', type: 'Automated Health & Safety' },
      { name: 'Internal QA Positive Test Result', source: 'Walmart Food Safety Lab + LIMS', type: 'Automated Quality Control' },
      { name: 'Customer Illness Report Cluster', source: 'Walmart Customer Care + Social Listening', type: 'Automated Customer Safety' },
    ],
    dataSources: [
      { name: 'CDC PulseNet Surveillance', status: 'Connected', dataPoints: 12000 },
      { name: 'Walmart Supply Chain Traceability', status: 'Connected', dataPoints: 890000 },
      { name: 'Store Inventory Management', status: 'Connected', dataPoints: 2400000 },
      { name: 'Customer Care CRM', status: 'Connected', dataPoints: 45000 },
    ],
    customizations: [
      { field: 'Recall Scope', before: 'Single product recall', after: 'Multi-product: all items from affected supplier across 847 stores + sam\'s club locations + walmart.com' },
      { field: 'Store-Level Execution', before: 'Manager notification only', after: 'Automated: POS block within 15 minutes, shelf-pull alerts to department managers, customer refund auto-authorization' },
      { field: 'Customer Notification', before: 'In-store signage', after: 'Multi-channel: Walmart app push notification, email to purchasers (receipt matching), in-store signage, social media, local news coordination' },
      { field: 'CDC Coordination', before: 'Reactive response', after: 'Proactive: shared traceability data with CDC within 1 hour, joint investigation team, hourly situation reports' },
    ],
    signal: { name: 'Salmonella Outbreak Linked to Walmart Fresh Produce — 847 Stores Potentially Affected', severity: 'CRITICAL', source: 'CDC PulseNet + Walmart Food Safety Lab', detail: 'CDC PulseNet identifies Salmonella Typhimurium cluster with 47 confirmed cases across 12 states. Genomic sequencing traces to pre-cut fruit products supplied by Pacific Fresh Produce to 847 Walmart stores in 23 states. 12,847 customers purchased affected products in the past 14 days (receipt data). 3 hospitalizations reported. FDA investigation initiated.' },
    aiInsights: [
      'Traceability analysis: Pacific Fresh Produce lot #PF-2024-0847 distributed to 847 stores between Jan 15-28 — full lot trace complete',
      'Customer exposure: 12,847 unique purchasers identified via Walmart Pay/receipt data — direct notification possible for 78% (10,020 customers)',
      'Supplier risk: Pacific Fresh Produce had 2 minor violations in past 18 months — pattern suggests systemic cold chain issue at processing facility',
      'Financial modeling: estimated recall cost $12M, potential litigation $50-200M depending on severity — early transparent response reduces by 60%',
    ],
    stakeholders: [
      { name: 'Doug McMillon', role: 'President & CEO', responseTime: '2 min 5 sec' },
      { name: 'John Furner', role: 'President & CEO, Walmart U.S.', responseTime: '58 seconds' },
      { name: 'Judith McKenna', role: 'President, Walmart International', responseTime: '1 min 42 sec' },
      { name: 'Dr. Frank Yiannas', role: 'VP Food Safety', responseTime: '22 seconds' },
      { name: 'Rachel Brand', role: 'EVP Global Governance & Chief Legal', responseTime: '1 min 30 sec' },
      { name: 'Tom Ward', role: 'EVP & Chief eCommerce Officer', responseTime: '1 min 15 sec' },
    ],
    executionTasks: [
      { task: 'POS system block activated — affected products unscannable at all 847 stores', tool: 'Walmart POS + NCR', status: 'Complete', time: '0:15' },
      { task: 'Automated shelf-pull alerts sent to 847 store managers', tool: 'Walmart One + Mobile', status: 'Complete', time: '0:30' },
      { task: 'Walmart app push notification to 10,020 identified purchasers', tool: 'Walmart App + Firebase', status: 'Complete', time: '1:00' },
      { task: 'CDC shared traceability data package transmitted', tool: 'Secure Transfer + API', status: 'Complete', time: '1:30' },
      { task: 'Supplier Pacific Fresh Produce suspended — all products held', tool: 'Supplier Portal + SAP', status: 'Complete', time: '2:00' },
      { task: 'Walmart.com product listings deactivated + order cancellations', tool: 'eCommerce Platform', status: 'Complete', time: '2:30' },
      { task: 'Customer refund auto-authorization for all affected purchases', tool: 'Walmart Pay + CRM', status: 'Complete', time: '3:30' },
      { task: 'Media statement and press conference coordinated', tool: 'PR + Cision', status: 'Complete', time: '5:00' },
      { task: 'Alternative fresh produce supplier activated for 847 stores', tool: 'Procurement + SAP', status: 'Complete', time: '7:00' },
      { task: '5,000 stakeholders coordinated, response fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:33' },
    ],
    outcomes: [
      { metric: 'Time to Product Removal', before: '7 days', after: '15 minutes (POS block)' },
      { metric: 'Customer Notification', before: 'In-store signage only', after: '10,020 direct notifications in 1 hour' },
      { metric: 'CDC Data Sharing', before: '3-5 days', after: '90 minutes' },
      { metric: 'Lives Protected + Liability Avoided', before: 'Continued exposure', after: '$245M liability reduced + faster patient treatment' },
    ],
    lesson: 'Prepared Response enhanced: Added "Supplier Violation Pattern Monitor" as a predictive trigger — 2 minor violations in 18 months now triggers proactive audit. POS-level product blocking reduced customer exposure from 7 days to 15 minutes. Receipt-based customer identification enabled unprecedented direct notification.',
  },
  'energy-grid': {
    id: 'energy-grid', title: 'Grid Infrastructure Emergency', organization: 'Pacific Grid & Power',
    industry: 'Energy & Utilities', icon: Zap, color: 'text-yellow-400', gradient: 'from-yellow-600 to-orange-800',
    scenario: 'Cascading Grid Failure — 8.2M Customers, 247 Substations, 3 States',
    domain: 'Crisis Management', domainCategory: 'RISK & RESILIENCE',
    playbook: { number: '082', name: 'Grid Emergency Response — Cascading Failure', tasks: 48, stakeholders: 2500, budget: '$85M' },
    triggers: [
      { name: 'SCADA Frequency Deviation Alert', source: 'SCADA/EMS + Grid Sensors', type: 'Automated Grid Monitoring' },
      { name: 'Substation Overload Cascade Detection', source: 'GE Grid Solutions + IoT', type: 'Automated Infrastructure' },
      { name: 'NERC Reliability Alert', source: 'NERC + Regional ISO', type: 'Automated Regulatory' },
    ],
    dataSources: [
      { name: 'SCADA/EMS Real-Time Grid', status: 'Connected', dataPoints: 4500000 },
      { name: 'Weather Prediction Models', status: 'Connected', dataPoints: 890000 },
      { name: 'Substation IoT Sensors', status: 'Connected', dataPoints: 2400000 },
      { name: 'Customer Outage Management', status: 'Connected', dataPoints: 890000 },
    ],
    customizations: [
      { field: 'Load Shedding Protocol', before: 'Rotating blackouts', after: 'Intelligent load shedding: protect hospitals/emergency services → critical infrastructure → residential with medical needs → commercial → general residential' },
      { field: 'Restoration Sequence', before: 'Geographic restoration', after: 'Priority-based: generation → transmission → critical substations → hospital feeders → emergency services → residential by medical need tier' },
      { field: 'Public Communication', before: 'Press release + website', after: 'Multi-channel: emergency alert system (WEA), utility app push, social media, radio/TV, 211 hotline, municipal coordination' },
      { field: 'Mutual Aid Activation', before: 'Manual phone calls', after: 'Automated: Western Electricity Coordinating Council mutual aid request → 12 utility partners → 3,400 line workers pre-positioned within 4 hours' },
    ],
    signal: { name: 'Cascading Grid Failure — 247 Substations Tripping, 8.2M Customers Losing Power', severity: 'CRITICAL', source: 'SCADA/EMS + Substation IoT + NERC Alert', detail: 'Extreme heat wave (118°F) causing record demand of 52 GW against 48 GW capacity. Generator trip at Diablo Canyon (2.2 GW) triggered cascading substation failures. 247 of 1,200 substations have tripped or are overloading. 8.2M customers across California, Nevada, and Arizona losing power. Grid frequency dropping to 59.85 Hz (emergency threshold: 59.5 Hz). NERC has issued Level 3 Energy Emergency Alert.' },
    aiInsights: [
      'Cascade analysis: 247 substations affected, 43 more at risk of thermal overload within 2 hours — proactive de-energization of 12 substations can prevent cascade extension',
      'Generation gap: 4.2 GW shortfall — emergency imports from Pacific Northwest (1.8 GW available) + demand response activation can close gap to 1.2 GW',
      'Critical infrastructure at risk: 47 hospitals, 23 water treatment plants, 12 airports currently on backup power — average backup runtime: 8 hours',
      'Heat casualties: ambient temperature 118°F — FEMA modeling predicts 340+ heat-related emergency calls per hour without power restoration to vulnerable communities',
    ],
    stakeholders: [
      { name: 'Patricia Poppe', role: 'CEO', responseTime: '38 seconds' },
      { name: 'Carolyn Burke', role: 'CFO', responseTime: '1 min 45 sec' },
      { name: 'Jason Wells', role: 'EVP Operations', responseTime: '22 seconds' },
      { name: 'Robert Kenney', role: 'VP Electric Operations', responseTime: '18 seconds' },
      { name: 'Sumeet Singh', role: 'Chief Risk Officer', responseTime: '1 min 5 sec' },
      { name: 'Mark Quinlan', role: 'VP Emergency Management', responseTime: '15 seconds' },
    ],
    executionTasks: [
      { task: 'Intelligent load shedding activated — hospitals and emergency services protected', tool: 'SCADA/EMS + ADMS', status: 'Complete', time: '0:15' },
      { task: 'Emergency power imports from Pacific Northwest initiated (1.8 GW)', tool: 'EIM + CAISO', status: 'Complete', time: '0:30' },
      { task: 'Demand response program activated — 2.4 GW commercial load reduction', tool: 'DR Platform + IoT', status: 'Complete', time: '1:00' },
      { task: 'NERC Level 3 response protocol activated across 3 states', tool: 'NERC + State EOCs', status: 'Complete', time: '1:30' },
      { task: 'Mutual aid request — 3,400 line workers mobilized from 12 utilities', tool: 'WECC Mutual Aid', status: 'Complete', time: '2:30' },
      { task: 'Emergency alert system (WEA) sent to 8.2M customers', tool: 'FEMA IPAWS + WEA', status: 'Complete', time: '3:00' },
      { task: 'Cooling center coordination with 340 municipal partners', tool: 'WebEOC + GIS', status: 'Complete', time: '4:00' },
      { task: 'Generator dispatch to 47 hospitals approaching backup limit', tool: 'Fleet Management', status: 'Complete', time: '5:00' },
      { task: 'Grid restoration sequence initiated — priority substations first', tool: 'SCADA + OMS', status: 'Complete', time: '7:00' },
      { task: '2,500 stakeholders coordinated, emergency response fully operational', tool: 'Readiness OS', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Emergency Coordination', before: '3-5 days', after: '11 minutes 47 seconds' },
      { metric: 'Critical Infrastructure Protection', before: 'Unknown during chaos', after: '47 hospitals + 23 water plants protected' },
      { metric: 'Grid Restoration', before: '5-7 days full restoration', after: '3 hours (priority substations)' },
      { metric: 'Lives Protected + Costs Avoided', before: 'Reactive response', after: '$2.5B infrastructure damage prevented + lives saved' },
    ],
    lesson: 'Prepared Response enhanced: Added "Heat Wave Demand Prediction" as a 72-hour advance trigger — predicts demand-capacity gaps 3 days ahead. Intelligent load shedding with medical-needs prioritization prevented 340+ potential heat casualties. Mutual aid auto-activation reduced line worker mobilization from 24 hours to 4 hours.',
  },
};

const FALLBACK_INDUSTRY = INDUSTRIES['financial-ransomware'];

const STAGES = [
  { id: 'intro', label: 'The Scenario' },
  { id: 'prepared response', label: 'Build Prepared Response' },
  { id: 'triggers', label: 'Configure Triggers' },
  { id: 'data', label: 'Connect Data' },
  { id: 'customize', label: 'Customize' },
  { id: 'signal', label: 'Signal Fires' },
  { id: 'analysis', label: 'Strategic Analysis' },
  { id: 'decision', label: 'The Decision' },
  { id: 'activation', label: 'Execution' },
  { id: 'warroom', label: 'War Room' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'learning', label: 'Learning' },
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 transition-all ${i <= step ? 'bg-[#0A0F2E]' : 'bg-white/10'} ${i === step ? 'h-1.5' : ''}`} />
      ))}
    </div>
  );
}

export default function IndustryExperience() {
  const params = useParams<{ industryId: string }>();
  const industryId = params?.industryId || 'financial-ransomware';
  const industry = INDUSTRIES[industryId] || FALLBACK_INDUSTRY;
  const [stage, setStage] = useState(0);
  const [activationStep, setActivationStep] = useState(0);

  const [userPlaybook, setUserPlaybook] = useState({ name: '', tasks: 0, stakeholders: 0, budget: '' });
  const [userTriggers, setUserTriggers] = useState<{name: string; source: string; type: string; enabled: boolean}[]>([]);
  const [userDataSources, setUserDataSources] = useState<{name: string; connected: boolean; dataPoints: number}[]>([]);
  const [userCustomizations, setUserCustomizations] = useState<{field: string; value: string}[]>([]);
  const [configComplete, setConfigComplete] = useState(false);
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTriggerOpen, setNewTriggerOpen] = useState(false);
  const [newDataSourceName, setNewDataSourceName] = useState('');
  const [newCustomField, setNewCustomField] = useState('');
  const [connectingIdx, setConnectingIdx] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setUserPlaybook({
      name: industry.playbook.name,
      tasks: industry.playbook.tasks,
      stakeholders: industry.playbook.stakeholders,
      budget: industry.playbook.budget,
    });
    setUserTriggers(industry.triggers.map(t => ({ name: t.name, source: t.source, type: t.type, enabled: true })));
    setUserDataSources(industry.dataSources.map(d => ({ name: d.name, connected: true, dataPoints: d.dataPoints })));
    setUserCustomizations(industry.customizations.map(c => ({ field: c.field, value: c.after })));
    setCustomTasks([]);
    setNewTaskInput('');
    setConfigComplete(false);
    setShowSummary(false);
    setStage(0);
    setActivationStep(0);
  }, [industryId]);

  const setupReadiness = useMemo(() => {
    let score = 0;
    let total = 4;
    if (userPlaybook.name.trim()) score++;
    if (userTriggers.filter(t => t.enabled).length > 0) score++;
    if (userDataSources.filter(d => d.connected).length > 0) score++;
    if (userCustomizations.some(c => c.value.trim())) score++;
    return { score, total, percent: Math.round((score / total) * 100) };
  }, [userPlaybook, userTriggers, userDataSources, userCustomizations]);

  useEffect(() => {
    setConfigComplete(setupReadiness.score === setupReadiness.total);
  }, [setupReadiness]);

  const next = useCallback(() => {
    const currentId = STAGES[stage]?.id;
    if (currentId === 'customize' && !showSummary) {
      setShowSummary(true);
      scrollToTop();
      return;
    }
    if (currentId === 'customize' && showSummary) {
      setShowSummary(false);
    }
    setStage(prev => Math.min(prev + 1, STAGES.length - 1));
    scrollToTop();
  }, [stage, showSummary]);
  const prev = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
      scrollToTop();
      return;
    }
    setStage(prev => Math.max(prev - 1, 0));
    scrollToTop();
  }, [showSummary]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  useEffect(() => {
    if (STAGES[stage]?.id === 'activation') {
      setActivationStep(0);
      const totalTasks = industry.executionTasks.length + customTasks.length;
      const interval = setInterval(() => {
        setActivationStep(prev => (prev < totalTasks - 1 ? prev + 1 : prev));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage, industry.executionTasks.length, customTasks.length]);

  const Icon = industry.icon;
  const currentStage = STAGES[stage];

  const allExecutionTasks = useMemo(() => {
    const base = [...industry.executionTasks];
    customTasks.forEach((task, i) => {
      base.push({ task, tool: 'Custom', status: 'Complete', time: `${9 + i}:00` });
    });
    return base;
  }, [industry.executionTasks, customTasks]);

  const enabledTriggers = userTriggers.filter(t => t.enabled);
  const connectedSources = userDataSources.filter(d => d.connected);
  const totalDataPoints = connectedSources.reduce((sum, s) => sum + s.dataPoints, 0);

  const handleToggleDataSource = (idx: number) => {
    const current = userDataSources[idx];
    if (!current.connected) {
      setConnectingIdx(idx);
      setTimeout(() => {
        setUserDataSources(prev => prev.map((d, i) => i === idx ? { ...d, connected: true } : d));
        setConnectingIdx(null);
      }, 1500);
    } else {
      setUserDataSources(prev => prev.map((d, i) => i === idx ? { ...d, connected: false } : d));
    }
  };

  const renderStage = () => {
    if (showSummary && currentStage.id === 'customize') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <CheckCircle2 className="h-16 w-16 text-[#2B8A6E] mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Configuration Summary</h2>
            <p className="text-[#6B7280]">Review your {industry.organization} setup before launching</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white border border-[#2B8A6E]/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#2B8A6E]" />
                <h3 className="font-semibold text-[#0A0F2E]">Your Prepared Response</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6B7280]">Name</span><span className="text-[#0A0F2E] font-medium">{userPlaybook.name}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Tasks</span><span className="text-[#0A0F2E] font-medium">{userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Stakeholders</span><span className="text-[#0A0F2E] font-medium">{userPlaybook.stakeholders}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Budget</span><span className="text-[#0A0F2E] font-medium">{userPlaybook.budget}</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-[#C9A84C]/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="h-5 w-5 text-[#C9A84C]" />
                <h3 className="font-semibold text-[#0A0F2E]">Active Triggers</h3>
              </div>
              <div className="space-y-2">
                {enabledTriggers.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-[#2B8A6E]" />
                    <span className="text-[#6B7280]">{t.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-[#0A0F2E]/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-[#0A0F2E]" />
                <h3 className="font-semibold text-[#0A0F2E]">Connected Data Sources</h3>
              </div>
              <div className="space-y-2">
                {connectedSources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">{s.name}</span>
                    <span className="text-[#0A0F2E] font-medium">{s.dataPoints.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#0A0F2E]/10 flex justify-between text-sm">
                <span className="text-[#6B7280]">Total Monitoring</span>
                <span className="text-[#0A0F2E] font-bold">{totalDataPoints.toLocaleString()} data points</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white border border-[#C9A84C]/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="h-5 w-5 text-[#C9A84C]" />
                <h3 className="font-semibold text-[#0A0F2E]">Customizations</h3>
              </div>
              <div className="space-y-2">
                {userCustomizations.filter(c => c.value.trim()).map((c, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-[#6B7280]">{c.field}: </span>
                    <span className="text-[#0A0F2E]">{c.value.slice(0, 60)}{c.value.length > 60 ? '...' : ''}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-center">
            <Button onClick={next} size="lg" className="bg-[#0A0F2E] hover:bg-[#141B45] text-white px-10 py-6 text-lg rounded-none font-bold uppercase tracking-widest">
              <Rocket className="h-5 w-5 mr-2" /> Launch Execution
            </Button>
          </motion.div>
        </div>
      );
    }

    switch (currentStage.id) {
      case 'intro':
        return (
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <div className={`w-20 h-20 bg-gradient-to-br ${industry.gradient} flex items-center justify-center mx-auto mb-6`}>
                <Icon className="h-10 w-10 text-[#0A0F2E]" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Badge className={`mb-4 rounded-none font-bold uppercase tracking-widest ${industry.domainCategory === 'GROWTH' ? 'bg-[#2B8A6E]/20 text-[#2B8A6E]' : industry.domainCategory === 'RISK & RESILIENCE' ? 'bg-[#0A0F2E]/20 text-[#C9A84C]' : 'bg-[#C9A84C]/20 text-[#C9A84C]'}`}>{industry.domainCategory} — {industry.domain}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A0F2E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{industry.organization}</h1>
              <p className="text-xl text-[#6B7280] mb-2">{industry.industry} Industry</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-8 bg-white border border-[#E8E4DC] p-8"
            >
              <div className="text-sm text-[#0A0F2E] uppercase tracking-wider mb-3">Industry Scenario</div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A0F2E] mb-4">{industry.scenario}</h2>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Configure your own playbook, triggers, data sources, and customizations. Then watch your personalized execution come alive as a real signal fires.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-[#6B7280] flex-wrap"
            >
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#2B8A6E]" /> Prepared Response #{industry.playbook.number}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#0A0F2E]" /> {industry.playbook.stakeholders.toLocaleString()} stakeholders</span>
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-amber-400" /> {industry.playbook.tasks} tasks</span>
              <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-[#2B8A6E]" /> {industry.playbook.budget} budget</span>
            </motion.div>
          </div>
        );

      case 'playbook':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#2B8A6E]/20 text-[#2B8A6E]"><BookOpen className="h-3 w-3 mr-1" /> BUILD YOUR PREPARED RESPONSE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Build Your Prepared Response</h2>
              <p className="text-[#6B7280]">Customize your prepared response for {industry.organization}</p>
            </div>
            {configComplete && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-none p-3 text-center">
                <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] inline mr-2" />
                <span className="text-sm text-[#2B8A6E] font-medium uppercase tracking-widest font-bold">Configuration Complete — All 4 setup stages have data</span>
              </motion.div>
            )}
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-[#6B7280] font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-[#2B8A6E]/20 overflow-hidden"
            >
              <div className="bg-[#2B8A6E]/30 border-b border-[#2B8A6E]/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-[#2B8A6E]" />
                  <span className="text-[#0A0F2E] font-semibold">Prepared Response Configuration</span>
                  <Badge variant="outline" className="text-xs">Template #{industry.playbook.number}</Badge>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pb-name" className="text-[#6B7280]">Prepared Response Name</Label>
                    <Input id="pb-name" value={userPlaybook.name}
                      onChange={e => setUserPlaybook(p => ({ ...p, name: e.target.value }))}
                      placeholder={industry.playbook.name}
                      className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-budget" className="text-[#6B7280]">Budget</Label>
                    <Input id="pb-budget" value={userPlaybook.budget}
                      onChange={e => setUserPlaybook(p => ({ ...p, budget: e.target.value }))}
                      placeholder={industry.playbook.budget}
                      className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-tasks" className="text-[#6B7280]">Number of Tasks</Label>
                    <Input id="pb-tasks" type="number" value={userPlaybook.tasks}
                      onChange={e => setUserPlaybook(p => ({ ...p, tasks: parseInt(e.target.value) || 0 }))}
                      className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-stakeholders" className="text-[#6B7280]">Stakeholder Count</Label>
                    <Input id="pb-stakeholders" type="number" value={userPlaybook.stakeholders}
                      onChange={e => setUserPlaybook(p => ({ ...p, stakeholders: parseInt(e.target.value) || 0 }))}
                      className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E]" />
                  </div>
                </div>
                <div className="border-t border-[#0A0F2E]/10 pt-6">
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">Task Sequence (from template)</div>
                  <div className="space-y-2 mb-4">
                    {industry.executionTasks.slice(0, 5).map((task, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-3">
                        <div className="w-6 h-6 bg-[#2B8A6E]/20 flex items-center justify-center text-xs text-[#2B8A6E] font-bold">{i + 1}</div>
                        <span className="text-sm text-[#6B7280] flex-1">{task.task}</span>
                        <Badge variant="outline" className="text-[10px]">{task.tool}</Badge>
                      </div>
                    ))}
                    {industry.executionTasks.length > 5 && (
                      <div className="text-center text-xs text-[#6B7280] py-1">+ {industry.executionTasks.length - 5} more template tasks</div>
                    )}
                  </div>
                  {customTasks.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-[#2B8A6E] uppercase tracking-wider mb-2">Your Custom Tasks</div>
                      <div className="space-y-2">
                        {customTasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-3 bg-[#2B8A6E]/5 border border-[#2B8A6E]/10 p-3">
                            <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] text-[10px]">Custom</Badge>
                            <span className="text-sm text-[#0A0F2E] flex-1">{task}</span>
                            <button onClick={() => setCustomTasks(prev => prev.filter((_, j) => j !== i))} className="text-[#6B7280] hover:text-red-400">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)}
                      placeholder="Add a custom task to the execution sequence..."
                      className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E] flex-1"
                      onKeyDown={e => { if (e.key === 'Enter' && newTaskInput.trim()) { setCustomTasks(prev => [...prev, newTaskInput.trim()]); setNewTaskInput(''); }}} />
                    <Button variant="outline" className="border-[#2B8A6E]/30 text-[#2B8A6E]"
                      onClick={() => { if (newTaskInput.trim()) { setCustomTasks(prev => [...prev, newTaskInput.trim()]); setNewTaskInput(''); }}}>
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mt-6 flex justify-end">
              <Button onClick={next} disabled={!userPlaybook.name.trim()} className="bg-gradient-to-r from-[#2B8A6E] to-[#141B45] text-white px-8">
                Next: Configure Triggers <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'triggers':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#C9A84C]/20 text-[#C9A84C] rounded-none font-bold uppercase tracking-widest"><Radio className="h-3 w-3 mr-1" /> TRIGGER CONFIGURATION</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Configure Your Triggers</h2>
              <p className="text-[#6B7280]">Set up conditions that activate your {industry.industry} prepared response</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-[#6B7280] font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <div className="space-y-4 mb-6">
              {userTriggers.map((trigger, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                  className={`bg-white border p-6 ${trigger.enabled ? 'border-[#C9A84C]/20' : 'border-[#0A0F2E]/10 opacity-60'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Radio className={`h-5 w-5 ${trigger.enabled ? 'text-[#C9A84C]' : 'text-[#6B7280]'}`} />
                      {i < industry.triggers.length ? (
                        <span className="text-[#0A0F2E] font-medium">{trigger.name}</span>
                      ) : (
                        <Input value={trigger.name}
                          onChange={e => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, name: e.target.value } : t))}
                          className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E] h-8 text-sm" placeholder="Trigger name" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={trigger.enabled} onCheckedChange={() => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, enabled: !t.enabled } : t))} />
                      {i >= industry.triggers.length && (
                        <button onClick={() => setUserTriggers(prev => prev.filter((_, j) => j !== i))} className="text-[#6B7280] hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-[#6B7280] block mb-1">Source</span>
                      <span className="text-[#6B7280]">{trigger.source}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#6B7280] block mb-1">Type</span>
                      <Badge variant="outline" className="text-xs text-[#0A0F2E] border-[#0A0F2E]/10">{trigger.type}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mb-6">
              {!newTriggerOpen ? (
                <Button variant="outline" className="border-[#C9A84C]/30 text-[#C9A84C]" onClick={() => setNewTriggerOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Custom Trigger
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#C9A84C]/20 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Trigger name..." className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E]"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            setUserTriggers(prev => [...prev, { name: input.value.trim(), source: 'Custom Source', type: 'Manual', enabled: true }]);
                            setNewTriggerOpen(false);
                          }
                        }
                      }} />
                    <div className="flex gap-2 md:col-span-2">
                      <Button variant="outline" className="border-[#C9A84C]/30 text-[#C9A84C]"
                        onClick={() => {
                          setUserTriggers(prev => [...prev, { name: 'Custom Trigger', source: 'Custom Source', type: 'Manual', enabled: true }]);
                          setNewTriggerOpen(false);
                        }}>Add</Button>
                      <Button variant="ghost" className="text-[#6B7280]" onClick={() => setNewTriggerOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-[#0A0F2E]/20 text-[#0A0F2E]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} disabled={enabledTriggers.length === 0} className="bg-gradient-to-r from-[#C9A84C] to-[#0A0F2E] text-white px-8">
                Next: Connect Data <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/20 text-[#0A0F2E]"><Database className="h-3 w-3 mr-1" /> CONNECT DATA SOURCES</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Connect Your Data Sources</h2>
              <p className="text-[#6B7280]">Link the systems that power {industry.organization}'s intelligence</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-[#6B7280] font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <div className="bg-white border border-[#E8E4DC] p-5 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-[#0A0F2E]" />
                  <span className="text-[#0A0F2E] font-medium">Data Intelligence Hub</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#6B7280]">{connectedSources.length}/{userDataSources.length} connected</span>
                  <span className="text-[#0A0F2E] font-bold">{totalDataPoints.toLocaleString()} data points</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {userDataSources.map((source, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.1 }}
                  className={`bg-white border rounded-none p-5 ${source.connected ? 'border-[#2B8A6E]/20' : 'border-[#E8E4DC]'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Workflow className={`h-5 w-5 ${source.connected ? 'text-[#C9A84C]' : 'text-[#0A0F2E]'}`} />
                      {i < industry.dataSources.length ? (
                        <span className="text-sm font-medium text-[#0A0F2E]">{source.name}</span>
                      ) : (
                        <Input value={source.name}
                          onChange={e => setUserDataSources(prev => prev.map((d, j) => j === i ? { ...d, name: e.target.value } : d))}
                          className="bg-[#F8F7F4] border-[#E8E4DC] text-[#0A0F2E] h-8 text-sm w-48" placeholder="Source name" />
                      )}
                    </div>
                    <button onClick={() => setUserDataSources(prev => prev.filter((_, j) => j !== i))} className="text-[#0A0F2E] hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={source.connected} onCheckedChange={() => handleToggleDataSource(i)} />
                      {connectingIdx === i ? (
                        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}
                          className="text-xs text-[#C9A84C]">Connecting...</motion.span>
                      ) : source.connected ? (
                        <span className="flex items-center gap-1 text-xs text-[#2B8A6E]">
                          <div className="w-1.5 h-1.5 bg-[#2B8A6E]" /> Connected
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B7280]">Disconnected</span>
                      )}
                    </div>
                    {source.connected && (
                      <span className="text-sm font-bold text-[#C9A84C]">{source.dataPoints.toLocaleString()} pts</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <Input value={newDataSourceName} onChange={e => setNewDataSourceName(e.target.value)}
                placeholder="Add a custom data source..."
                className="bg-[#F8F7F4] border-[#E8E4DC] text-[#0A0F2E] flex-1"
                onKeyDown={e => { if (e.key === 'Enter' && newDataSourceName.trim()) {
                  setUserDataSources(prev => [...prev, { name: newDataSourceName.trim(), connected: false, dataPoints: 0 }]);
                  setNewDataSourceName('');
                }}} />
              <Button variant="outline" className="border-[#E8E4DC] text-[#0A0F2E] rounded-none"
                onClick={() => { if (newDataSourceName.trim()) {
                  setUserDataSources(prev => [...prev, { name: newDataSourceName.trim(), connected: false, dataPoints: 0 }]);
                  setNewDataSourceName('');
                }}}>
                <Plus className="h-4 w-4 mr-1" /> Add Data Source
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-[#E8E4DC] text-[#0A0F2E] rounded-none">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} disabled={connectedSources.length === 0} className="bg-[#0A0F2E] hover:bg-[#141B45] text-white rounded-none px-8">
                Next: Customize <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/10 text-[#0A0F2E] border-0 rounded-none"><Sliders className="h-3 w-3 mr-1" /> CUSTOMIZE CONFIGURATION</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Customize Your Configuration</h2>
              <p className="text-[#6B7280]">Fine-tune each setting for {industry.organization}</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1 [&>div]:bg-[#C9A84C]" />
              <span className="text-xs text-[#0A0F2E] font-medium">{setupReadiness.percent}% ready</span>
            </div>
            {configComplete && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-[#2B8A6E]/10 border border-[#2B8A6E]/20 rounded-none p-3 text-center">
                <CheckCircle2 className="h-4 w-4 text-[#2B8A6E] inline mr-2" />
                <span className="text-sm text-[#2B8A6E] font-medium">Configuration Complete — Ready to launch execution</span>
              </motion.div>
            )}
            <div className="space-y-4 mb-6">
              {userCustomizations.map((custom, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-white border border-[#E8E4DC] rounded-none p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-[#0A0F2E] font-medium">{custom.field}</Label>
                    {i >= industry.customizations.length && (
                      <button onClick={() => setUserCustomizations(prev => prev.filter((_, j) => j !== i))} className="text-[#0A0F2E] hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {i < industry.customizations.length && (
                    <div className="text-xs text-[#6B7280] mb-2">
                      Default: <span className="text-[#0A0F2E]">{industry.customizations[i].before}</span> → <span className="text-[#C9A84C]">{industry.customizations[i].after}</span>
                    </div>
                  )}
                  <Textarea value={custom.value}
                    onChange={e => setUserCustomizations(prev => prev.map((c, j) => j === i ? { ...c, value: e.target.value } : c))}
                    placeholder={i < industry.customizations.length ? industry.customizations[i].after : 'Enter your custom configuration...'}
                    className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E] min-h-[60px]" />
                  {custom.value.trim() && custom.value !== (i < industry.customizations.length ? industry.customizations[i].after : '') && (
                    <Badge className="mt-2 bg-[#2B8A6E]/20 text-[#2B8A6E] text-[10px]">Your Configuration</Badge>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <Input value={newCustomField} onChange={e => setNewCustomField(e.target.value)}
                placeholder="Add a custom setting name..."
                className="bg-white/5 border-[#0A0F2E]/10 text-[#0A0F2E] flex-1"
                onKeyDown={e => { if (e.key === 'Enter' && newCustomField.trim()) {
                  setUserCustomizations(prev => [...prev, { field: newCustomField.trim(), value: '' }]);
                  setNewCustomField('');
                }}} />
              <Button variant="outline" className="border-[#0A0F2E]/30 text-[#0A0F2E]"
                onClick={() => { if (newCustomField.trim()) {
                  setUserCustomizations(prev => [...prev, { field: newCustomField.trim(), value: '' }]);
                  setNewCustomField('');
                }}}>
                <Plus className="h-4 w-4 mr-1" /> Add Custom Setting
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-[#0A0F2E]/20 text-[#0A0F2E]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} className="bg-[#0A0F2E] text-white hover:bg-[#141B45] px-8">
                <Rocket className="h-4 w-4 mr-2" /> Review & Launch
              </Button>
            </div>
          </div>
        );

      case 'signal':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 text-sm font-medium mb-4"
              >
                <div className="w-2 h-2 bg-red-500 animate-pulse" />
                SIGNAL DETECTED
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">The Trigger Fires</h2>
              <p className="text-[#6B7280]">Your {industry.industry} trigger has detected a critical event</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white border border-red-500/30 overflow-hidden"
            >
              <div className="bg-red-950/50 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </motion.div>
                  <span className="text-red-400 font-semibold">{industry.signal.severity} SIGNAL</span>
                </div>
                <Badge className="bg-red-500 text-white">{industry.signal.severity}</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{industry.signal.name}</h3>
                <p className="text-gray-800 dark:text-slate-200 mb-6 leading-relaxed">{industry.signal.detail}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-3 text-center">
                    <Eye className="h-5 w-5 text-[#0A0F2E] mx-auto mb-1" />
                    <div className="text-xs text-gray-800">Source</div>
                    <div className="text-sm text-gray-900 font-medium">{industry.signal.source}</div>
                  </div>
                  <div className="bg-white/5 p-3 text-center">
                    <BookOpen className="h-5 w-5 text-[#2B8A6E] mx-auto mb-1" />
                    <div className="text-xs text-gray-800">Your Prepared Response</div>
                    <div className="text-sm text-gray-900 font-medium">{userPlaybook.name}</div>
                    {userPlaybook.name !== industry.playbook.name && <Badge className="mt-1 bg-[#2B8A6E]/20 text-[#2B8A6E] text-[8px]">Custom</Badge>}
                  </div>
                  <div className="bg-white/5 p-3 text-center">
                    <Bell className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-800">Stakeholders Ready</div>
                    <div className="text-sm text-gray-900 font-medium">{userPlaybook.stakeholders.toLocaleString()} identified</div>
                  </div>
                </div>
                {enabledTriggers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-800 mb-2">Your Active Triggers</div>
                    <div className="flex flex-wrap gap-2">
                      {enabledTriggers.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-amber-400 border-amber-500/20">{t.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'analysis':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/20 text-[#0A0F2E]"><Brain className="h-3 w-3 mr-1" /> STRATEGIC ANALYSIS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">The System Analyzes the Situation</h2>
              <p className="text-gray-800 dark:text-slate-200">The system analyzes {totalDataPoints.toLocaleString()} data points from your connected sources</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="bg-white border border-[#0A0F2E]/20 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-[#0A0F2E]" />
                  <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
                </div>
                <div className="space-y-3">
                  {industry.aiInsights.map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
                      className="flex items-start gap-3 bg-white/5 p-3"
                    >
                      <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-800">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="bg-white border border-[#0A0F2E]/20 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Confidence</h3>
                  <div className="flex items-end gap-4 mb-4">
                    <div className="text-5xl font-bold text-[#C9A84C]">96%</div>
                    <div className="text-sm text-gray-800 dark:text-slate-200 pb-2">recommendation confidence</div>
                  </div>
                  <div className="h-3 bg-gray-50 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '96%' }} transition={{ delay: 0.8, duration: 1.5 }}
                      className="h-full bg-[#C9A84C]" />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                  className="bg-white border border-[#2B8A6E]/20 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendation</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    "Activate <span className="text-gray-900 font-semibold">{userPlaybook.name}</span> immediately. 
                    {userPlaybook.stakeholders.toLocaleString()} stakeholders identified, {userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''} tasks pre-configured, {userPlaybook.budget} budget pre-approved."
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'decision':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/20 text-[#0A0F2E]"><Shield className="h-3 w-3 mr-1" /> AI MONITORS — EXECUTIVES AUTHORIZE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Leadership Makes the Call</h2>
              <p className="text-gray-800 dark:text-slate-200">AI recommends. The executive decides. Always.</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-[#E8E4DC] p-8"
            >
              <div className="flex items-center gap-5 mb-6">
                <div style={{ width: 4, alignSelf: 'stretch', background: '#C9A84C', flexShrink: 0 }} />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{industry.organization}</h3>
                  <p className="text-gray-800 dark:text-slate-200">{industry.industry} — {industry.domain}</p>
                </div>
              </div>
              <div className="bg-[#0A0F2E]/30 border border-white/10 p-5 mb-6">
                <div className="text-xs text-[#0A0F2E] uppercase tracking-wider mb-2">Decision Required</div>
                <p className="text-gray-800">
                  Activate <span className="text-gray-900 font-semibold">{userPlaybook.name}</span> with {userPlaybook.stakeholders.toLocaleString()} stakeholders, 
                  {' '}{userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''} pre-configured tasks, and {userPlaybook.budget} pre-approved budget?
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-[#2B8A6E]">{userPlaybook.tasks + customTasks.length}</div>
                  <div className="text-xs text-gray-800">Tasks Ready</div>
                </div>
                <div className="bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-[#0A0F2E]">{userPlaybook.stakeholders.toLocaleString()}</div>
                  <div className="text-xs text-gray-800">Stakeholders Mapped</div>
                </div>
                <div className="bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-[#2B8A6E]">{userPlaybook.budget}</div>
                  <div className="text-xs text-gray-800">Budget Pre-Approved</div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-3 bg-[#2B8A6E]/20 border border-[#2B8A6E]/30 text-[#2B8A6E] px-8 py-4 rounded-none font-bold uppercase tracking-widest text-lg"
              >
                <CheckCircle2 className="h-6 w-6" />
                APPROVED — {industry.organization.split(' ')[0]} Activates {userPlaybook.name}
              </motion.div>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="text-center text-sm text-gray-800 mt-6"
            >
              Every activation requires human approval. Readiness OS accelerates the process — humans retain full decision authority.
            </motion.p>
          </div>
        );

      case 'activation':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <Badge className="mb-3 bg-[#2B8A6E]/20 text-[#2B8A6E] rounded-none font-bold uppercase tracking-widest"><Zap className="h-3 w-3 mr-1" /> EXECUTE PHASE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">12-Minute Execution in Progress</h2>
              <p className="text-[#6B7280]">Watch as tasks auto-create, stakeholders coordinate, and systems activate</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 bg-white border border-[#2B8A6E]/20 rounded-none p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Execution Timeline</h3>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-[#2B8A6E]" />
                    <span className="text-[#2B8A6E] text-xs font-bold uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {allExecutionTasks.map((task, i) => {
                    const isActive = i <= activationStep;
                    const isCurrent = i === activationStep;
                    const isCustom = i >= industry.executionTasks.length;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: isActive ? 1 : 0.25, x: isActive ? 0 : -20 }}
                        className={`flex items-center gap-3 p-2.5 rounded-none ${isCurrent ? 'bg-[#2B8A6E]/10 ring-1 ring-[#2B8A6E]/20' : ''}`}
                      >
                        <div className="w-12 text-right font-mono text-xs text-gray-800">{task.time}</div>
                        <div className={`w-5 h-5 flex items-center justify-center ${isActive ? 'bg-[#2B8A6E]/20' : 'bg-white/5'}`}>
                          <CheckCircle2 className={`h-3 w-3 ${isActive ? 'text-[#2B8A6E]' : 'text-slate-700'}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-800 dark:text-slate-200'}`}>{task.task}</div>
                        </div>
                        {isCustom && <Badge className="bg-[#2B8A6E]/20 text-[#2B8A6E] text-[8px] rounded-none font-bold uppercase">Custom</Badge>}
                        <Badge variant="outline" className={`text-[10px] rounded-none ${isActive ? '' : 'opacity-30'}`}>{task.tool}</Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="bg-white border border-[#0A0F2E]/20 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Stakeholder Response</h3>
                  <div className="space-y-2">
                    {industry.stakeholders.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: i <= activationStep ? 1 : 0.2 }} transition={{ delay: i * 0.3 }}
                        className="flex items-center justify-between bg-white/5 p-2.5"
                      >
                        <div>
                          <div className="text-xs text-gray-900 font-medium">{s.name}</div>
                          <div className="text-[10px] text-gray-800">{s.role}</div>
                        </div>
                        {i <= activationStep && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-[#2B8A6E]" />
                            <span className="text-[10px] text-[#2B8A6E]">{s.responseTime}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#C9A84C]/20 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-800 dark:text-slate-200">Tasks</span>
                        <span className="text-[#2B8A6E]">{Math.min(activationStep + 1, allExecutionTasks.length)}/{allExecutionTasks.length}</span>
                      </div>
                      <Progress value={((activationStep + 1) / allExecutionTasks.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-800 dark:text-slate-200">Stakeholders</span>
                        <span className="text-[#0A0F2E]">{Math.min(activationStep + 1, industry.stakeholders.length)}/{industry.stakeholders.length}</span>
                      </div>
                      <Progress value={((Math.min(activationStep + 1, industry.stakeholders.length)) / industry.stakeholders.length) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'warroom':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/20 text-[#0A0F2E]"><MessageSquare className="h-3 w-3 mr-1" /> WAR ROOM</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Command Center — Live</h2>
              <p className="text-[#6B7280]">{industry.organization} — Real-time coordination across {userPlaybook.stakeholders.toLocaleString()} stakeholders</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white border border-[#2B8A6E]/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#2B8A6E] animate-pulse" />
                  <span className="text-xs text-[#2B8A6E] font-medium">OPERATIONAL</span>
                </div>
                <div className="text-2xl font-bold text-[#0A0F2E]">{allExecutionTasks.length}</div>
                <div className="text-xs text-[#6B7280]">Tasks Executing</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white border border-[#0A0F2E]/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-[#0A0F2E]" />
                  <span className="text-xs text-[#0A0F2E] font-medium">COORDINATED</span>
                </div>
                <div className="text-2xl font-bold text-[#0A0F2E]">{userPlaybook.stakeholders.toLocaleString()}</div>
                <div className="text-xs text-[#6B7280]">Stakeholders Aligned</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white border border-[#C9A84C]/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-[#C9A84C]" />
                  <span className="text-xs text-[#C9A84C] font-medium">ELAPSED</span>
                </div>
                <div className="text-2xl font-bold text-[#0A0F2E]">11:47</div>
                <div className="text-xs text-[#6B7280]">Total Execution Time</div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white border border-[#0A0F2E]/20 p-6"
            >
              <h3 className="font-semibold text-[#0A0F2E] mb-4">Live Activity Feed</h3>
              <div className="space-y-3">
                {[
                  { msg: `${industry.stakeholders[0]?.name || 'CEO'}: "Prepared Response activated. All teams report status in 5 minutes."`, time: '2 min ago', color: 'border-[#2B8A6E]/30' },
                  { msg: `AI Alert: All ${allExecutionTasks.length} tasks executing on schedule. ${connectedSources.length} data sources feeding real-time intelligence.`, time: '1 min ago', color: 'border-[#C9A84C]/30' },
                  { msg: `Readiness OS: "${userPlaybook.name}" fully operational. ${userPlaybook.stakeholders.toLocaleString()} stakeholders coordinated in under 12 minutes.`, time: '1 min ago', color: 'border-[#2B8A6E]/30' },
                  { msg: `${industry.stakeholders[1]?.name || 'COO'}: "Confirmed — all teams aligned and executing."`, time: 'Just now', color: 'border-[#0A0F2E]/30' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.3 }}
                    className={`border-l-2 ${item.color} pl-4 py-2`}
                  >
                    <p className="text-sm text-[#6B7280]">{item.msg}</p>
                    <span className="text-xs text-[#6B7280]">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'outcomes':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#2B8A6E]/20 text-[#2B8A6E]"><Award className="h-3 w-3 mr-1" /> OUTCOMES</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Execution Results</h2>
              <p className="text-[#6B7280]">The measurable impact of your {industry.industry} prepared response</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industry.outcomes.map((outcome, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
                  className="bg-white border border-[#2B8A6E]/20 p-6"
                >
                  <h4 className="text-sm text-[#0A0F2E] mb-3">{outcome.metric}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-[#6B7280] mb-1">Before Readiness OS</div>
                      <div className="text-lg font-semibold text-red-400 line-through decoration-red-500/50">{outcome.before}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#2B8A6E] shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-[#6B7280] mb-1">With Readiness OS</div>
                      <div className="text-lg font-semibold text-[#2B8A6E]">{outcome.after}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-[#0A0F2E]/20 text-[#0A0F2E]"><Lightbulb className="h-3 w-3 mr-1" /> ADVANCE PHASE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2E] mb-2">Institutional Learning</h2>
              <p className="text-[#6B7280]">Every execution makes {industry.organization} smarter</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-[#0A0F2E]/20 p-8 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-[#0A0F2E]" />
                <h3 className="text-lg font-semibold text-[#0A0F2E]">System-Generated Prepared Response Refinement</h3>
              </div>
              <p className="text-[#6B7280] leading-relaxed">{industry.lesson}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-white border border-[#0A0F2E]/20 p-4 text-center">
                <BarChart3 className="h-6 w-6 text-[#0A0F2E] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#0A0F2E]">170</div>
                <div className="text-xs text-[#6B7280]">Total Prepared responses</div>
              </div>
              <div className="bg-white border border-[#C9A84C]/20 p-4 text-center">
                <Brain className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#0A0F2E]">94%</div>
                <div className="text-xs text-[#6B7280]">Signal Precision</div>
              </div>
              <div className="bg-white border border-[#2B8A6E]/20 p-4 text-center">
                <Timer className="h-6 w-6 text-[#2B8A6E] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#0A0F2E]">&lt;12 min</div>
                <div className="text-xs text-[#6B7280]">Avg. Execution</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="text-center space-y-4"
            >
              <p className="text-[#6B7280]">
                You've just experienced the full IDEA Framework — from IDENTIFY through ADVANCE — for {industry.organization}.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/industry-demos">
                  <Button variant="outline" className="border-[#0A0F2E]/20 text-[#0A0F2E]">
                    <ArrowLeft className="h-4 w-4 mr-2" /> More Industry Scenarios
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button className="bg-[#0A0F2E] text-white hover:bg-[#141B45] px-8">
                    Start Your Pilot <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/industry-demos">
              <Button variant="ghost" className="text-[#6B7280] hover:text-[#0A0F2E] font-bold uppercase tracking-widest text-[10px] p-0">
                <ArrowLeft className="h-3 w-3 mr-2" /> Industry Scenarios
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              <span className="text-[#0A0F2E]">{stage + 1} / {STAGES.length}</span>
              <span className="w-8 h-px bg-[#E8E4DC]" />
              <span className="text-[#0A0F2E]">{currentStage.label}</span>
            </div>
          </div>
          <StepIndicator step={stage} total={STAGES.length} />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStage.id}-${showSummary ? 'summary' : 'main'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderStage()}
            </motion.div>
          </AnimatePresence>

          {!showSummary && !['prepared response', 'triggers', 'data', 'customize', 'learning'].includes(currentStage.id) && (
            <div className="max-w-5xl mx-auto mt-16 flex justify-between border-t border-[#F8F7F4] pt-8">
              <Button variant="outline" onClick={prev} disabled={stage === 0} className="border-[#0A0F2E] text-[#0A0F2E] hover:bg-[#0A0F2E] hover:text-white rounded-none px-10 py-6 font-bold uppercase tracking-widest text-[10px] transition-colors">
                <ArrowLeft className="h-3 w-3 mr-2" /> Previous
              </Button>
              <Button onClick={next} disabled={stage === STAGES.length - 1} className="bg-[#0A0F2E] text-white hover:bg-[#141B45] rounded-none px-12 py-6 font-bold uppercase tracking-widest text-[10px]">
                Next Stage <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}