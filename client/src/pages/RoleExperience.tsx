import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Briefcase, DollarSign, Settings, TrendingUp, Server, Shield,
  Users, Scale, Database, FileCheck, Target, ArrowRight, ArrowLeft,
  Zap, Play, Brain, Radio, BookOpen, CheckCircle2, Clock,
  AlertTriangle, Globe, Building2, Lightbulb, MessageSquare,
  FileText, Eye, ChevronRight, ChevronLeft, Layers,
  Plus, Search, Filter, Edit3, Sliders, Bell, BarChart3,
  Activity, Lock, Workflow, Award, Rocket, Timer, X, Trash2
} from 'lucide-react';

interface RoleData {
  id: string;
  title: string;
  name: string;
  company: string;
  icon: any;
  color: string;
  gradient: string;
  scenario: string;
  domain: string;
  domainCategory: 'OFFENSE' | 'DEFENSE' | 'SPECIAL TEAMS';
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

const ROLES: Record<string, RoleData> = {
  ceo: {
    id: 'ceo', title: 'Chief Executive Officer', name: 'Jennifer Park', company: 'Meridian Financial Group',
    icon: Briefcase, color: 'text-blue-400', gradient: 'from-blue-600 to-indigo-700',
    scenario: 'M&A Integration — $2.3B Acquisition of CloudTech Solutions',
    domain: 'Mergers & Acquisitions', domainCategory: 'OFFENSE',
    playbook: { number: '12', name: 'M&A Day 1 Integration', tasks: 34, stakeholders: 45, budget: '$1.2M' },
    triggers: [
      { name: 'Deal Close Confirmation', source: 'Legal / Board Resolution', type: 'Manual Executive Trigger' },
      { name: 'SEC Filing Published', source: 'SEC EDGAR API', type: 'Automated Regulatory' },
      { name: 'Market Reaction Alert', source: 'Bloomberg Terminal', type: 'Automated Financial' },
    ],
    dataSources: [
      { name: 'Bloomberg Terminal', status: 'Connected', dataPoints: 847 },
      { name: 'SEC EDGAR', status: 'Connected', dataPoints: 234 },
      { name: 'Salesforce CRM', status: 'Connected', dataPoints: 1420 },
      { name: 'Workday HR', status: 'Connected', dataPoints: 3200 },
    ],
    customizations: [
      { field: 'Stakeholder Tiers', before: '3 tiers (default)', after: '5 tiers with Board, C-Suite, VP, Director, Manager' },
      { field: 'Notification Channels', before: 'Email + Slack', after: 'Email + Slack + Teams + SMS for Tier 1' },
      { field: 'Budget Authority', before: 'Single approver', after: 'Dual-sign for >$500K, auto-approve <$100K' },
      { field: 'Communication Templates', before: '6 default templates', after: '14 custom: investor, employee, customer, partner, media, regulator' },
    ],
    signal: { name: 'Deal Close Confirmed — CloudTech Acquisition Finalized', severity: 'CRITICAL', source: 'Board Resolution + SEC Filing', detail: 'The $2.3B acquisition of CloudTech Solutions has been approved by both boards. SEC 8-K filing submitted. Integration clock starts now.' },
    aiInsights: [
      '3,200 employees across 4 countries require Day 1 communications within 2 hours',
      'Customer overlap: 340 shared accounts need retention outreach within 24 hours',
      'Technology stack integration: 78% compatibility, 3 critical system migrations identified',
      'Cultural assessment: 82% alignment score, HR attention needed in Engineering teams',
    ],
    stakeholders: [
      { name: 'Sarah Chen', role: 'CFO', responseTime: '47 seconds' },
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '1 min 12 sec' },
      { name: 'Emily Taylor', role: 'Chief Legal Officer', responseTime: '2 min 3 sec' },
      { name: 'Lisa Anderson', role: 'CMO', responseTime: '2 min 45 sec' },
      { name: 'David Wilson', role: 'COO', responseTime: '3 min 10 sec' },
      { name: 'Robert Kim', role: 'CHRO', responseTime: '3 min 48 sec' },
    ],
    executionTasks: [
      { task: 'Employee all-hands communication sent', tool: 'Google Workspace', status: 'Complete', time: '0:30' },
      { task: 'Customer retention war room created', tool: 'Slack', status: 'Complete', time: '1:00' },
      { task: 'Integration PMO Jira board created', tool: 'Jira', status: 'Complete', time: '1:30' },
      { task: 'Investor relations briefing staged', tool: 'Microsoft Teams', status: 'Complete', time: '2:00' },
      { task: 'IT systems access provisioning initiated', tool: 'Okta + ServiceNow', status: 'Complete', time: '3:00' },
      { task: 'Regulatory compliance checklist activated', tool: 'ServiceNow', status: 'Complete', time: '4:00' },
      { task: 'Media holding statement distributed', tool: 'Email + PR Wire', status: 'Complete', time: '5:00' },
      { task: '45 stakeholders coordinated, war room live', tool: 'ExecuteIQ', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Full Coordination', before: '3-5 days', after: '11 minutes 47 seconds' },
      { metric: 'Day 1 Employee Communications', before: '48 hours', after: '30 minutes' },
      { metric: 'Customer Retention Outreach', before: '2 weeks', after: 'Same day' },
      { metric: 'Integration Cost Savings', before: 'N/A', after: '$4.2M in avoided delays' },
    ],
    lesson: 'Integration playbook refined: added "CloudTech-specific" technology migration checklist based on actual system gaps discovered during execution. Updated stakeholder tiers to include acquired company leadership in Tier 2.',
  },
  ciso: {
    id: 'ciso', title: 'Chief Information Security Officer', name: 'Robert Kim', company: 'Meridian Financial Group',
    icon: Shield, color: 'text-red-400', gradient: 'from-red-600 to-rose-700',
    scenario: 'Ransomware Attack — Production Systems Compromised at 2:17 AM',
    domain: 'Cybersecurity Incident', domainCategory: 'DEFENSE',
    playbook: { number: '31', name: 'Critical Incident Response — Ransomware', tasks: 28, stakeholders: 30, budget: '$350K' },
    triggers: [
      { name: 'Anomalous Encryption Activity', source: 'AWS CloudWatch + CrowdStrike', type: 'Automated Security' },
      { name: 'Data Exfiltration Pattern', source: 'Splunk SIEM', type: 'Automated Threat Detection' },
      { name: 'SOC Analyst Escalation', source: 'PagerDuty', type: 'Manual Security Trigger' },
    ],
    dataSources: [
      { name: 'AWS CloudWatch', status: 'Connected', dataPoints: 12400 },
      { name: 'CrowdStrike Falcon', status: 'Connected', dataPoints: 8900 },
      { name: 'Splunk SIEM', status: 'Connected', dataPoints: 45000 },
      { name: 'PagerDuty', status: 'Connected', dataPoints: 320 },
    ],
    customizations: [
      { field: 'Escalation Tiers', before: '3 severity levels', after: '5 levels with auto-escalation at 5-min SLA breach' },
      { field: 'Notification Priority', before: 'Email first', after: 'SMS + Phone call for P1, PagerDuty for P2, Slack for P3+' },
      { field: 'Auto-Isolation Rules', before: 'Manual approval', after: 'Auto-isolate affected subnets within 60 seconds of detection' },
      { field: 'Compliance Templates', before: '3 templates', after: '8 templates: SEC, GDPR, State AG, FBI, Insurance, Board, Customer, Media' },
    ],
    signal: { name: 'Ransomware Detected — Production Servers Under Active Encryption', severity: 'CRITICAL', source: 'AWS CloudWatch + CrowdStrike Falcon', detail: 'Unusual encryption activity detected across 47 production servers in us-east-1. CrowdStrike confirmed malware signature matching LockBit 3.0 variant. 2.3TB of data potentially affected.' },
    aiInsights: [
      'Attack vector: compromised VPN credentials from phishing campaign 72 hours ago',
      'Lateral movement detected across 3 network segments — isolation recommended immediately',
      'Offline backups verified clean — RPO of 4 hours achievable for full recovery',
      'Regulatory notification deadline: 72 hours for SEC, 48 hours for affected state AGs',
    ],
    stakeholders: [
      { name: 'James Martinez', role: 'VP Engineering', responseTime: '34 seconds' },
      { name: 'Jennifer Park', role: 'CEO', responseTime: '1 min 2 sec' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '1 min 28 sec' },
      { name: 'Emily Taylor', role: 'Chief Legal Officer', responseTime: '2 min 15 sec' },
      { name: 'Susan Lee', role: 'Director of IT', responseTime: '42 seconds' },
      { name: 'Christopher White', role: 'Director of Security', responseTime: '28 seconds' },
    ],
    executionTasks: [
      { task: 'Network segments isolated', tool: 'AWS + Palo Alto', status: 'Complete', time: '0:45' },
      { task: 'Incident war room created', tool: 'Slack', status: 'Complete', time: '1:00' },
      { task: 'ServiceNow ticket auto-created (INC-2024-47291)', tool: 'ServiceNow', status: 'Complete', time: '1:15' },
      { task: 'Forensics team engaged', tool: 'CrowdStrike', status: 'Complete', time: '2:00' },
      { task: 'Backup integrity verified', tool: 'AWS S3 + Veeam', status: 'Complete', time: '3:30' },
      { task: 'Legal review of notification requirements', tool: 'Microsoft Teams', status: 'Complete', time: '4:00' },
      { task: 'Customer communication drafted', tool: 'Google Workspace', status: 'Complete', time: '6:00' },
      { task: '30 stakeholders coordinated, recovery initiated', tool: 'ExecuteIQ', status: 'Complete', time: '11:47' },
    ],
    outcomes: [
      { metric: 'Time to Containment', before: '8+ hours', after: '45 seconds' },
      { metric: 'Stakeholder Coordination', before: '4-6 hours', after: '11 minutes 47 seconds' },
      { metric: 'Regulatory Filing', before: 'Scramble at deadline', after: 'Prepared within 2 hours' },
      { metric: 'Financial Impact Avoided', before: 'N/A', after: '$12.8M in breach costs avoided' },
    ],
    lesson: 'Playbook updated: added auto-isolation rule that triggered 3 minutes faster than manual process. VPN monitoring trigger added to detect credential compromise earlier. Phishing response playbook cross-linked for upstream prevention.',
  },
  cmo: {
    id: 'cmo', title: 'Chief Marketing Officer', name: 'Lisa Anderson', company: 'Meridian Financial Group',
    icon: TrendingUp, color: 'text-purple-400', gradient: 'from-purple-600 to-pink-700',
    scenario: 'Competitive Response — Major Competitor Launches Rival Product',
    domain: 'Competitive Response', domainCategory: 'OFFENSE',
    playbook: { number: '47', name: 'Competitive Response — Product Counter-Strategy', tasks: 24, stakeholders: 28, budget: '$250K' },
    triggers: [
      { name: 'Competitor Press Release Detected', source: 'PR Newswire + Google Alerts', type: 'Automated Competitive' },
      { name: 'Social Media Surge Detection', source: 'Brandwatch + Sprout Social', type: 'Automated Social' },
      { name: 'Sales Team Competitive Alert', source: 'Salesforce + Slack', type: 'Manual Field Report' },
    ],
    dataSources: [
      { name: 'Brandwatch Social Listening', status: 'Connected', dataPoints: 24000 },
      { name: 'Salesforce CRM', status: 'Connected', dataPoints: 1420 },
      { name: 'Google Trends API', status: 'Connected', dataPoints: 890 },
      { name: 'G2/Gartner Reviews', status: 'Connected', dataPoints: 340 },
    ],
    customizations: [
      { field: 'Response Timeline', before: '14-day response plan', after: '72-hour rapid response + 14-day sustained campaign' },
      { field: 'Channel Activation', before: 'Email + Blog', after: 'Multi-channel: Email, Blog, Social, Paid, Sales Enablement, Analyst Briefing' },
      { field: 'Competitive Matrix', before: 'Generic comparison', after: 'Dynamic matrix auto-populated from G2 data + internal win/loss analysis' },
      { field: 'Customer Messaging', before: 'Single message', after: '4 segment-specific messages: Enterprise, Mid-Market, SMB, Partners' },
    ],
    signal: { name: 'Competitor Product Launch — Direct Threat to Enterprise Segment', severity: 'HIGH', source: 'PR Newswire + Brandwatch Surge', detail: 'Competitor announced "Enterprise AI Platform" with pricing 15% below market, targeting our top 340 enterprise accounts. Pre-launch partnerships with 3 major SIs detected.' },
    aiInsights: [
      'Competitor pricing undercuts by 15% — recommend value-based repositioning, not price matching',
      '340 at-risk accounts identified: 47 in active renewal window (next 90 days)',
      'Social sentiment shifting: 23% increase in competitor mentions among target audience',
      'Product feature overlap: 78% — differentiation messaging should focus on our integration depth',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 5 sec' },
      { name: 'Ryan Davis', role: 'VP Sales', responseTime: '1 min 12 sec' },
      { name: 'Laura Lewis', role: 'VP Product', responseTime: '1 min 45 sec' },
      { name: 'Patricia Wright', role: 'VP Strategy', responseTime: '2 min 30 sec' },
      { name: 'Daniel Moore', role: 'Director of PR', responseTime: '55 seconds' },
      { name: 'Rachel Young', role: 'Director of Communications', responseTime: '1 min 30 sec' },
    ],
    executionTasks: [
      { task: 'Competitive analysis brief generated', tool: 'Google Workspace', status: 'Complete', time: '0:30' },
      { task: 'Sales enablement battle cards updated', tool: 'Salesforce + Seismic', status: 'Complete', time: '1:30' },
      { task: 'Customer retention outreach to 47 at-risk accounts', tool: 'Salesforce + Outreach', status: 'Complete', time: '2:00' },
      { task: 'Social media counter-narrative launched', tool: 'Sprout Social', status: 'Complete', time: '3:00' },
      { task: 'Analyst briefing scheduled', tool: 'Microsoft Teams', status: 'Complete', time: '4:00' },
      { task: 'Product roadmap acceleration memo drafted', tool: 'Jira + Confluence', status: 'Complete', time: '5:00' },
      { task: 'Pricing response proposal submitted for approval', tool: 'Google Workspace', status: 'Complete', time: '7:00' },
      { task: '28 stakeholders aligned, counter-strategy live', tool: 'ExecuteIQ', status: 'Complete', time: '11:22' },
    ],
    outcomes: [
      { metric: 'Time to Market Response', before: '21 days', after: '3 days' },
      { metric: 'At-Risk Account Retention', before: '72%', after: '94%' },
      { metric: 'Market Share Protected', before: 'Unknown', after: '$12M ARR retained' },
      { metric: 'Sales Team Readiness', before: '2 weeks', after: 'Same day' },
    ],
    lesson: 'Playbook enhanced: added "SI Partnership Monitoring" as a new trigger source after discovering competitor SI partnerships were a leading indicator. Customer segmentation messaging refined from 2 to 4 tiers based on actual response data.',
  },
  cfo: {
    id: 'cfo', title: 'Chief Financial Officer', name: 'Sarah Chen', company: 'Meridian Financial Group',
    icon: DollarSign, color: 'text-emerald-400', gradient: 'from-emerald-600 to-green-700',
    scenario: 'Regulatory Change — New SEC Climate Disclosure Requirements',
    domain: 'Regulatory Compliance', domainCategory: 'DEFENSE',
    playbook: { number: '58', name: 'Regulatory Compliance — Financial Reporting', tasks: 32, stakeholders: 22, budget: '$180K' },
    triggers: [
      { name: 'SEC Rule Change Published', source: 'Federal Register API', type: 'Automated Regulatory' },
      { name: 'Compliance Deadline Alert', source: 'Thomson Reuters Regulatory Intelligence', type: 'Automated Compliance' },
      { name: 'CFO Manual Activation', source: 'Executive Dashboard', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'Thomson Reuters', status: 'Connected', dataPoints: 2100 },
      { name: 'Federal Register API', status: 'Connected', dataPoints: 890 },
      { name: 'Workday Financials', status: 'Connected', dataPoints: 4500 },
      { name: 'SAP ERP', status: 'Connected', dataPoints: 8200 },
    ],
    customizations: [
      { field: 'Compliance Timeline', before: 'Standard 90-day window', after: 'Phase-gated: 30-day assessment, 45-day implementation, 15-day audit' },
      { field: 'Reporting Templates', before: '4 standard reports', after: '12 reports: SEC 10-K addendum, Board memo, Audit committee brief, ESG disclosures' },
      { field: 'Approval Workflow', before: 'Single sign-off', after: 'Triple review: Finance → Legal → External Auditor' },
      { field: 'Cost Tracking', before: 'Manual spreadsheet', after: 'Real-time budget tracking with variance alerts at 80% and 95% thresholds' },
    ],
    signal: { name: 'SEC Climate Disclosure Rule Finalized — 120-Day Compliance Deadline', severity: 'HIGH', source: 'Federal Register + Thomson Reuters', detail: 'SEC has finalized climate-related disclosure requirements for large accelerated filers. Meridian must comply with Scope 1 and 2 emissions reporting by Q2 filing deadline. Material impact on 10-K disclosures.' },
    aiInsights: [
      'Gap analysis: 4 of 7 required data collection processes not yet established',
      'External auditor coordination needed — Big 4 capacity constraints in peak season',
      'Peer company analysis: 3 of 5 peers have already begun compliance preparation',
      'Estimated compliance cost: $140K-$180K, within pre-approved budget threshold',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '3 min 12 sec' },
      { name: 'Emily Taylor', role: 'Chief Legal Officer', responseTime: '1 min 45 sec' },
      { name: 'Jessica Thompson', role: 'Director of Compliance', responseTime: '52 seconds' },
      { name: 'Eric Green', role: 'Director of Audit', responseTime: '1 min 18 sec' },
      { name: 'Gregory Adams', role: 'VP Investor Relations', responseTime: '2 min 5 sec' },
      { name: 'Angela Baker', role: 'Director of Analytics', responseTime: '2 min 45 sec' },
    ],
    executionTasks: [
      { task: 'Compliance gap assessment initiated', tool: 'ServiceNow', status: 'Complete', time: '0:30' },
      { task: 'External auditor engagement letter sent', tool: 'DocuSign', status: 'Complete', time: '1:00' },
      { task: 'Data collection workflow created', tool: 'Jira', status: 'Complete', time: '2:00' },
      { task: 'Board audit committee briefing scheduled', tool: 'Microsoft Teams', status: 'Complete', time: '3:00' },
      { task: 'ESG reporting template configured', tool: 'Workday + SAP', status: 'Complete', time: '4:30' },
      { task: 'Investor relations FAQ prepared', tool: 'Google Workspace', status: 'Complete', time: '6:00' },
      { task: 'Cross-functional compliance team assembled', tool: 'Slack', status: 'Complete', time: '8:00' },
      { task: '22 stakeholders coordinated, compliance program live', tool: 'ExecuteIQ', status: 'Complete', time: '10:34' },
    ],
    outcomes: [
      { metric: 'Time to Compliance Program Launch', before: '5 weeks', after: '10 minutes 34 seconds' },
      { metric: 'Stakeholder Alignment', before: '10+ meetings', after: 'Single coordinated activation' },
      { metric: 'Audit Readiness', before: '90 days', after: '45 days (50% faster)' },
      { metric: 'Compliance Cost', before: 'Unknown until late', after: '$142K — tracked real-time' },
    ],
    lesson: 'Playbook updated: Added "Big 4 Capacity Check" as a pre-flight step after discovering auditor availability was a bottleneck. Created reusable template for future SEC rule changes. Linked to ESG reporting playbook for cross-domain coordination.',
  },
  coo: {
    id: 'coo', title: 'Chief Operating Officer', name: 'David Wilson', company: 'Meridian Financial Group',
    icon: Settings, color: 'text-amber-400', gradient: 'from-amber-600 to-orange-700',
    scenario: 'Supply Chain Disruption — Critical Vendor Data Center Outage',
    domain: 'Crisis Management', domainCategory: 'DEFENSE',
    playbook: { number: '39', name: 'Vendor Crisis — Critical Infrastructure Failure', tasks: 26, stakeholders: 24, budget: '$200K' },
    triggers: [
      { name: 'Vendor SLA Breach Alert', source: 'ServiceNow + Datadog', type: 'Automated Infrastructure' },
      { name: 'Customer Impact Threshold', source: 'Zendesk + Statuspage', type: 'Automated Customer Impact' },
      { name: 'Operations Team Escalation', source: 'PagerDuty', type: 'Manual Operations Trigger' },
    ],
    dataSources: [
      { name: 'Datadog APM', status: 'Connected', dataPoints: 34000 },
      { name: 'ServiceNow CMDB', status: 'Connected', dataPoints: 5600 },
      { name: 'Zendesk Support', status: 'Connected', dataPoints: 2300 },
      { name: 'Statuspage', status: 'Connected', dataPoints: 120 },
    ],
    customizations: [
      { field: 'Impact Assessment', before: 'Manual evaluation', after: 'Auto-calculated from CMDB dependencies + real-time customer impact score' },
      { field: 'Vendor Escalation Path', before: 'Single contact', after: '3-tier escalation: Account Manager → VP → CEO with auto-escalation at 30/60/120 min' },
      { field: 'Failover Procedures', before: 'Generic runbook', after: 'Vendor-specific runbooks with tested failover for top 10 critical vendors' },
      { field: 'Customer Communication', before: 'Ad-hoc', after: 'Tiered: real-time statuspage, email at 30min/2hr/resolved, account manager for Tier 1' },
    ],
    signal: { name: 'Critical Vendor Outage — Primary Cloud Provider Data Center Down', severity: 'CRITICAL', source: 'Datadog + ServiceNow SLA Breach', detail: 'Primary cloud infrastructure vendor experiencing complete outage in US-EAST region. 12 production services affected. Customer impact: 4,200 users experiencing degraded service. SLA breach threshold exceeded.' },
    aiInsights: [
      'CMDB analysis: 12 production services depend on affected vendor — 3 have failover, 9 do not',
      'Customer impact: 4,200 users affected, 340 Tier 1 accounts, estimated revenue at risk: $2.1M/day',
      'Vendor historical data: similar outage 6 months ago lasted 4.2 hours — prepare for extended event',
      'Failover recommendation: activate DR for 3 critical services immediately, manual workarounds for 6 others',
    ],
    stakeholders: [
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '38 seconds' },
      { name: 'Susan Lee', role: 'Director of IT', responseTime: '45 seconds' },
      { name: 'Amanda Jackson', role: 'VP Customer Success', responseTime: '1 min 22 sec' },
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 5 sec' },
      { name: 'Brian Walker', role: 'Director of Infrastructure', responseTime: '32 seconds' },
      { name: 'Ryan Davis', role: 'VP Sales', responseTime: '3 min 10 sec' },
    ],
    executionTasks: [
      { task: 'DR failover initiated for 3 critical services', tool: 'AWS + Terraform', status: 'Complete', time: '0:45' },
      { task: 'Customer statuspage updated', tool: 'Statuspage', status: 'Complete', time: '1:00' },
      { task: 'Vendor escalation initiated (CEO level)', tool: 'Email + Phone', status: 'Complete', time: '1:30' },
      { task: 'Incident war room created with vendor liaison', tool: 'Slack + Zoom', status: 'Complete', time: '2:00' },
      { task: 'Tier 1 account managers notified with talking points', tool: 'Salesforce + Slack', status: 'Complete', time: '3:00' },
      { task: 'Manual workarounds deployed for 6 non-DR services', tool: 'Jira + Confluence', status: 'Complete', time: '5:00' },
      { task: 'SLA credit tracking initiated', tool: 'ServiceNow', status: 'Complete', time: '7:00' },
      { task: '24 stakeholders coordinated, response fully active', tool: 'ExecuteIQ', status: 'Complete', time: '11:12' },
    ],
    outcomes: [
      { metric: 'Time to Failover', before: '2-4 hours', after: '45 seconds' },
      { metric: 'Customer Communication', before: '1-2 hours', after: '1 minute' },
      { metric: 'Revenue Protected', before: 'Unknown', after: '$2.1M/day saved' },
      { metric: 'Vendor Accountability', before: 'Post-incident', after: 'Real-time SLA tracking from minute 1' },
    ],
    lesson: 'Playbook refined: Added failover runbooks for 6 additional services that lacked DR. Vendor escalation SLA tightened from 60-min to 30-min auto-escalation. Added "vendor financial health monitoring" as a leading indicator trigger.',
  },
  cto: {
    id: 'cto', title: 'Chief Technology Officer', name: 'Michael Rodriguez', company: 'Meridian Financial Group',
    icon: Server, color: 'text-cyan-400', gradient: 'from-cyan-600 to-blue-700',
    scenario: 'Digital Transformation — Enterprise AI Platform Rollout',
    domain: 'Digital Transformation', domainCategory: 'SPECIAL TEAMS',
    playbook: { number: '72', name: 'AI Governance & Platform Launch', tasks: 38, stakeholders: 35, budget: '$2.8M' },
    triggers: [
      { name: 'Board AI Strategy Approval', source: 'Board Resolution', type: 'Manual Executive Trigger' },
      { name: 'Technology Readiness Gate', source: 'Jira + Confluence', type: 'Automated Project Gate' },
      { name: 'Regulatory AI Framework Published', source: 'NIST/EU AI Act Monitor', type: 'Automated Regulatory' },
    ],
    dataSources: [
      { name: 'Jira Project Tracking', status: 'Connected', dataPoints: 4200 },
      { name: 'GitHub Enterprise', status: 'Connected', dataPoints: 12000 },
      { name: 'Datadog Performance', status: 'Connected', dataPoints: 34000 },
      { name: 'Confluence Knowledge Base', status: 'Connected', dataPoints: 890 },
    ],
    customizations: [
      { field: 'Governance Framework', before: 'Basic AI policy', after: 'Full AI governance: ethics board, model registry, bias monitoring, audit trail' },
      { field: 'Rollout Phases', before: '2 phases', after: '5 phases: Pilot → Limited GA → Department → Enterprise → External' },
      { field: 'Risk Assessment', before: 'Annual review', after: 'Continuous: automated bias detection, model drift alerts, compliance scanning' },
      { field: 'Training Program', before: 'Single workshop', after: '4-track: Executive, Technical, User, Champion with certification' },
    ],
    signal: { name: 'Board Approved AI Strategy — Enterprise Rollout Authorized', severity: 'HIGH', source: 'Board Resolution + CTO Activation', detail: 'Board has approved $2.8M budget for enterprise AI platform deployment. 6 departments, 35 stakeholders, 18-month timeline. Governance framework required before any production deployment.' },
    aiInsights: [
      '6 departments identified for phased rollout — Engineering and Finance are highest readiness (87%)',
      'EU AI Act compliance required for 3 use cases classified as "high-risk"',
      'Talent gap: need 4 ML engineers and 2 AI ethicists — recruiting pipeline has 12 candidates',
      'Infrastructure assessment: current GPU allocation covers Phase 1-2, budget needed for Phase 3+',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 30 sec' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '3 min 5 sec' },
      { name: 'James Martinez', role: 'VP Engineering', responseTime: '48 seconds' },
      { name: 'Nicole Hall', role: 'Director of Data', responseTime: '1 min 12 sec' },
      { name: 'Emily Taylor', role: 'Chief Legal Officer', responseTime: '2 min 45 sec' },
      { name: 'Michelle Harris', role: 'Director of HR', responseTime: '3 min 22 sec' },
    ],
    executionTasks: [
      { task: 'AI Governance committee formation initiated', tool: 'Microsoft Teams', status: 'Complete', time: '0:30' },
      { task: 'Model registry and audit trail configured', tool: 'MLflow + GitHub', status: 'Complete', time: '1:30' },
      { task: 'EU AI Act compliance assessment launched', tool: 'ServiceNow + Jira', status: 'Complete', time: '2:30' },
      { task: 'Phase 1 pilot department onboarding started', tool: 'Confluence + Slack', status: 'Complete', time: '3:30' },
      { task: 'Training program enrollment opened', tool: 'Workday Learning', status: 'Complete', time: '5:00' },
      { task: 'Infrastructure provisioning requests submitted', tool: 'AWS + Terraform', status: 'Complete', time: '6:00' },
      { task: 'Recruiting pipeline activated for AI roles', tool: 'Workday + LinkedIn', status: 'Complete', time: '8:00' },
      { task: '35 stakeholders coordinated, program fully launched', tool: 'ExecuteIQ', status: 'Complete', time: '11:33' },
    ],
    outcomes: [
      { metric: 'Time to Program Launch', before: '3-4 months', after: '11 minutes 33 seconds' },
      { metric: 'Cross-Department Alignment', before: '6-8 weeks', after: 'Same day' },
      { metric: 'Governance Framework', before: 'Built from scratch', after: 'Pre-configured, customized in minutes' },
      { metric: 'Projected Timeline Savings', before: '18 months', after: '14 months (22% faster)' },
    ],
    lesson: 'Playbook enhanced: Added EU AI Act compliance checklist as mandatory pre-flight step. Created reusable "Department Readiness Assessment" template. Linked Digital Transformation playbook to AI Governance playbook for cross-domain execution.',
  },
  chro: {
    id: 'chro', title: 'Chief Human Resources Officer', name: 'Michelle Harris', company: 'Meridian Financial Group',
    icon: Users, color: 'text-pink-400', gradient: 'from-pink-600 to-rose-700',
    scenario: 'Workforce Transformation — Post-Merger Cultural Integration',
    domain: 'Organizational Change', domainCategory: 'OFFENSE',
    playbook: { number: '85', name: 'Post-M&A Cultural Integration', tasks: 30, stakeholders: 32, budget: '$450K' },
    triggers: [
      { name: 'Change Management Survey Alert', source: 'Workday + Culture Amp', type: 'Automated HR' },
      { name: 'Employee Attrition Spike', source: 'Workday + LinkedIn', type: 'Automated Workforce' },
      { name: 'Executive Team Request', source: 'CHRO Dashboard', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'Workday HR', status: 'Connected', dataPoints: 8200 },
      { name: 'Culture Amp', status: 'Connected', dataPoints: 3400 },
      { name: 'LinkedIn Talent', status: 'Connected', dataPoints: 1200 },
      { name: 'Glassdoor Monitor', status: 'Connected', dataPoints: 560 },
    ],
    customizations: [
      { field: 'Integration Timeline', before: '8-week standard', after: '16-week phased: Quick Wins → Foundation → Deep Integration → Sustainability' },
      { field: 'Communication Cadence', before: 'Monthly townhall', after: 'Weekly pulse + Bi-weekly townhall + Daily manager huddles' },
      { field: 'Retention Packages', before: 'Standard package', after: 'Tiered: Critical talent 2x, Key contributors 1.5x, General 1x with stay bonuses' },
      { field: 'Culture Assessment', before: 'Annual survey', after: 'Continuous: weekly pulse, monthly deep-dive, quarterly culture audit' },
    ],
    signal: { name: 'Critical Culture Gap Detected — Engineering Team Attrition Risk', severity: 'HIGH', source: 'Culture Amp + Workday + LinkedIn', detail: 'Post-merger culture assessment reveals 34% engagement drop in acquired company engineering teams. LinkedIn profile update activity up 280% among senior engineers. 12 critical-path employees have active recruiter conversations.' },
    aiInsights: [
      '34% engagement drop concentrated in 3 acquired engineering teams — immediate intervention needed',
      '12 critical-path employees at flight risk — combined replacement cost: $3.6M',
      'Root cause analysis: role ambiguity (67%), culture clash (54%), manager quality (48%)',
      'Peer company benchmark: successful integrations resolve culture gaps within 90 days or face 2x attrition',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 45 sec' },
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '1 min 12 sec' },
      { name: 'James Martinez', role: 'VP Engineering', responseTime: '48 seconds' },
      { name: 'Karen Lopez', role: 'Director of Culture', responseTime: '38 seconds' },
      { name: 'David Wilson', role: 'COO', responseTime: '3 min 5 sec' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '3 min 30 sec' },
    ],
    executionTasks: [
      { task: 'Retention package offers prepared for 12 critical employees', tool: 'Workday', status: 'Complete', time: '0:30' },
      { task: 'Skip-level listening sessions scheduled', tool: 'Microsoft Teams', status: 'Complete', time: '1:00' },
      { task: 'Manager coaching program launched', tool: 'Culture Amp', status: 'Complete', time: '1:30' },
      { task: 'Role clarity workshops created for 3 teams', tool: 'Confluence + Slack', status: 'Complete', time: '2:30' },
      { task: 'Integration buddy program initiated', tool: 'Slack', status: 'Complete', time: '3:30' },
      { task: 'Culture alignment workshops scheduled', tool: 'Microsoft Teams', status: 'Complete', time: '5:00' },
      { task: 'Updated career path framework published', tool: 'Workday', status: 'Complete', time: '7:00' },
      { task: '32 stakeholders coordinated, integration program live', tool: 'ExecuteIQ', status: 'Complete', time: '10:48' },
    ],
    outcomes: [
      { metric: 'Time to Culture Intervention', before: '6 weeks', after: '24 hours' },
      { metric: 'Critical Talent Retention', before: '65%', after: '94%' },
      { metric: 'Integration Timeline', before: '18 months', after: '9 months' },
      { metric: 'Employee Engagement Recovery', before: 'Unknown', after: '$3.6M retention value saved' },
    ],
    lesson: 'Playbook enhanced: Added "LinkedIn Activity Monitor" as an early warning trigger — catches flight risk 3 weeks earlier than survey data alone. Created reusable "Skip-Level Listening Session" template. Integration buddy program now auto-activates for all future M&A playbooks.',
  },
  cdo: {
    id: 'cdo', title: 'Chief Data Officer', name: 'Nicole Hall', company: 'Meridian Financial Group',
    icon: Database, color: 'text-indigo-400', gradient: 'from-indigo-600 to-violet-700',
    scenario: 'Data Strategy — Enterprise Customer 360 Platform Launch',
    domain: 'Digital Transformation', domainCategory: 'SPECIAL TEAMS',
    playbook: { number: '78', name: 'Enterprise Data Platform Rollout', tasks: 36, stakeholders: 28, budget: '$1.8M' },
    triggers: [
      { name: 'Data Quality Threshold Breach', source: 'Collibra + Great Expectations', type: 'Automated Data Quality' },
      { name: 'Cross-Department Data Request Surge', source: 'ServiceNow + Jira', type: 'Automated Demand' },
      { name: 'CDO Strategic Activation', source: 'Executive Dashboard', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'Collibra Data Catalog', status: 'Connected', dataPoints: 14000 },
      { name: 'Snowflake Analytics', status: 'Connected', dataPoints: 45000 },
      { name: 'Great Expectations', status: 'Connected', dataPoints: 2800 },
      { name: 'Informatica MDM', status: 'Connected', dataPoints: 8900 },
    ],
    customizations: [
      { field: 'Data Governance Model', before: 'Basic metadata', after: 'Full governance: data stewards, quality SLAs, lineage tracking, privacy classification' },
      { field: 'Rollout Sequence', before: 'All at once', after: 'Department by department: Sales → Marketing → Finance → Operations → Product' },
      { field: 'Quality Gates', before: 'Pass/fail', after: '5-tier: Critical, Major, Minor, Cosmetic, Enhancement with auto-remediation' },
      { field: 'Privacy Framework', before: 'GDPR only', after: 'Multi-regulatory: GDPR + CCPA + HIPAA + SOX with automated classification' },
    ],
    signal: { name: 'Customer Data Fragmentation Critical — 5 Systems, No Single Source of Truth', severity: 'HIGH', source: 'Collibra + ServiceNow Demand Surge', detail: 'Customer data spread across 5 siloed systems with 23% duplicate records, 18% outdated information, and zero cross-system lineage. Sales, Marketing, and Support making decisions from conflicting customer views. 340 enterprise accounts affected.' },
    aiInsights: [
      '23% duplicate customer records costing $2.1M annually in redundant outreach and missed cross-sell',
      '5 data silos identified: Salesforce, HubSpot, Zendesk, SAP, internal data lake — no master record',
      'Privacy compliance gap: 340 enterprise accounts lack complete consent records across all systems',
      'Recommended approach: phased Customer 360 build starting with Sales + Marketing (highest ROI)',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '3 min 10 sec' },
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '1 min 5 sec' },
      { name: 'Ryan Davis', role: 'VP Sales', responseTime: '1 min 45 sec' },
      { name: 'Lisa Anderson', role: 'CMO', responseTime: '2 min 12 sec' },
      { name: 'Angela Baker', role: 'Director of Analytics', responseTime: '42 seconds' },
      { name: 'Eric Green', role: 'Director of Audit', responseTime: '2 min 50 sec' },
    ],
    executionTasks: [
      { task: 'Data quality assessment initiated across 5 systems', tool: 'Collibra', status: 'Complete', time: '0:30' },
      { task: 'Master data management rules configured', tool: 'Informatica MDM', status: 'Complete', time: '1:30' },
      { task: 'Customer identity resolution workflow launched', tool: 'Snowflake', status: 'Complete', time: '2:30' },
      { task: 'Data steward assignments and training scheduled', tool: 'Slack + Confluence', status: 'Complete', time: '3:30' },
      { task: 'Privacy compliance audit triggered', tool: 'ServiceNow', status: 'Complete', time: '5:00' },
      { task: 'Phase 1 Sales + Marketing integration started', tool: 'Jira', status: 'Complete', time: '6:30' },
      { task: 'Executive dashboard with data quality metrics configured', tool: 'Snowflake + Collibra', status: 'Complete', time: '8:00' },
      { task: '28 stakeholders coordinated, Customer 360 program live', tool: 'ExecuteIQ', status: 'Complete', time: '11:15' },
    ],
    outcomes: [
      { metric: 'Time to Program Launch', before: '2 months', after: '11 minutes 15 seconds' },
      { metric: 'Data Duplication', before: '23%', after: '2.3% target' },
      { metric: 'Customer View Accuracy', before: 'Unknown', after: '98% single source of truth' },
      { metric: 'Revenue Impact', before: 'N/A', after: '$2.1M saved in Year 1' },
    ],
    lesson: 'Playbook refined: Added "Privacy Compliance Pre-Check" as mandatory step before any data consolidation. Created reusable "Data Quality Scorecard" template. Linked to AI Governance playbook for ML model data requirements.',
  },
  gc: {
    id: 'gc', title: 'General Counsel', name: 'Emily Taylor', company: 'Meridian Financial Group',
    icon: Scale, color: 'text-slate-300', gradient: 'from-slate-600 to-gray-700',
    scenario: 'Regulatory Change — New AI Regulation Compliance Across 4 Jurisdictions',
    domain: 'Regulatory Compliance', domainCategory: 'SPECIAL TEAMS',
    playbook: { number: '94', name: 'Multi-Jurisdiction AI Compliance', tasks: 34, stakeholders: 26, budget: '$320K' },
    triggers: [
      { name: 'Regulatory Publication Alert', source: 'LexisNexis + Federal Register', type: 'Automated Regulatory' },
      { name: 'Court Decision Impact Alert', source: 'Westlaw', type: 'Automated Legal' },
      { name: 'GC Manual Activation', source: 'Legal Dashboard', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'LexisNexis', status: 'Connected', dataPoints: 4500 },
      { name: 'Westlaw', status: 'Connected', dataPoints: 3200 },
      { name: 'Federal Register API', status: 'Connected', dataPoints: 890 },
      { name: 'EU Official Journal', status: 'Connected', dataPoints: 1200 },
    ],
    customizations: [
      { field: 'Jurisdiction Mapping', before: 'US-only', after: 'Multi-jurisdiction: US Federal, EU AI Act, UK AIDA, California CPRA' },
      { field: 'Compliance Timeline', before: 'Single deadline', after: 'Parallel track with jurisdiction-specific milestones and dependencies' },
      { field: 'Impact Assessment', before: 'Basic checklist', after: 'Comprehensive: product impact, operational changes, contract amendments, training requirements' },
      { field: 'Reporting Structure', before: 'Legal-only', after: 'Cross-functional: Legal, Technology, Compliance, Business Units, External Counsel' },
    ],
    signal: { name: 'Multi-Jurisdiction AI Regulation Published — 120-Day Compliance Window', severity: 'HIGH', source: 'Federal Register + EU Official Journal + LexisNexis', detail: 'Concurrent AI regulations published: EU AI Act enforcement begins, US executive order implementation guidelines released, California CPRA AI provisions activated, UK AIDA framework published. Meridian operates AI systems in all 4 jurisdictions with 14 AI products affected.' },
    aiInsights: [
      '14 AI products require compliance assessment — 3 classified as "high-risk" under EU AI Act',
      'Conflicting requirements identified between EU and California on consent mechanisms',
      'External counsel capacity: preferred firms have 6-week wait — recommend immediate engagement',
      'Contract amendment needed for 47 vendor agreements that reference AI processing',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 30 sec' },
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '1 min 15 sec' },
      { name: 'Jessica Thompson', role: 'Director of Compliance', responseTime: '45 seconds' },
      { name: 'Robert Kim', role: 'CISO', responseTime: '1 min 30 sec' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '3 min 5 sec' },
      { name: 'Patricia Wright', role: 'VP Strategy', responseTime: '2 min 45 sec' },
    ],
    executionTasks: [
      { task: 'Multi-jurisdiction gap analysis initiated', tool: 'LexisNexis + Westlaw', status: 'Complete', time: '0:30' },
      { task: 'External counsel engagement letters sent to 3 firms', tool: 'DocuSign', status: 'Complete', time: '1:00' },
      { task: 'AI product inventory and risk classification completed', tool: 'Jira + Confluence', status: 'Complete', time: '2:00' },
      { task: 'Contract amendment tracker created for 47 vendors', tool: 'ServiceNow', status: 'Complete', time: '3:30' },
      { task: 'Board legal brief drafted', tool: 'Google Workspace', status: 'Complete', time: '5:00' },
      { task: 'Cross-functional compliance committee formed', tool: 'Microsoft Teams', status: 'Complete', time: '6:30' },
      { task: 'Training program for AI product teams launched', tool: 'Workday Learning', status: 'Complete', time: '8:00' },
      { task: '26 stakeholders coordinated, compliance program live', tool: 'ExecuteIQ', status: 'Complete', time: '10:22' },
    ],
    outcomes: [
      { metric: 'Time to Compliance Launch', before: '6 weeks', after: '10 minutes 22 seconds' },
      { metric: 'Regulatory Coverage', before: 'US-only', after: '4 jurisdictions simultaneously' },
      { metric: 'Risk Exposure', before: 'Unknown', after: '$8.4M in potential fines avoided' },
      { metric: 'External Counsel Coordination', before: 'Ad-hoc', after: 'Structured with SLA tracking' },
    ],
    lesson: 'Playbook enhanced: Added "Conflicting Jurisdiction Detector" that cross-references requirements across regions automatically. Created reusable "Vendor AI Clause Amendment" template. Linked to AI Governance playbook for technical compliance requirements.',
  },
  cco: {
    id: 'cco', title: 'Chief Compliance Officer', name: 'Jessica Thompson', company: 'Meridian Financial Group',
    icon: FileCheck, color: 'text-teal-400', gradient: 'from-teal-600 to-cyan-700',
    scenario: 'Compliance Emergency — Surprise Regulatory Audit with 48-Hour Notice',
    domain: 'Regulatory Compliance', domainCategory: 'DEFENSE',
    playbook: { number: '62', name: 'Emergency Regulatory Audit Response', tasks: 30, stakeholders: 20, budget: '$150K' },
    triggers: [
      { name: 'Regulatory Notice Received', source: 'Email + Legal Inbox', type: 'Manual Compliance Trigger' },
      { name: 'Compliance Deadline Alert', source: 'Thomson Reuters', type: 'Automated Compliance' },
      { name: 'Audit Committee Request', source: 'Board Portal', type: 'Manual Board Trigger' },
    ],
    dataSources: [
      { name: 'Thomson Reuters Regulatory Intelligence', status: 'Connected', dataPoints: 2100 },
      { name: 'AuditBoard', status: 'Connected', dataPoints: 3800 },
      { name: 'LogicGate GRC', status: 'Connected', dataPoints: 5600 },
      { name: 'MetricStream', status: 'Connected', dataPoints: 1400 },
    ],
    customizations: [
      { field: 'Response Timeline', before: 'Standard 30-day', after: 'Emergency 48-hour: Triage → Assemble → Document → Respond' },
      { field: 'Document Retrieval', before: 'Manual search', after: 'Automated: pre-tagged evidence library with AI-powered retrieval' },
      { field: 'Team Assembly', before: 'Single compliance team', after: 'Cross-functional rapid response: Compliance, Legal, Finance, IT, Operations' },
      { field: 'Communication Protocol', before: 'Ad-hoc', after: 'Structured: hourly status updates, escalation triggers at 12/24/36 hour marks' },
    ],
    signal: { name: 'Surprise OCC Examination Notice — 48 Hours to Full Readiness', severity: 'CRITICAL', source: 'OCC Official Correspondence + Legal Inbox', detail: 'Office of the Comptroller of the Currency has issued a surprise examination notice. Focus areas: BSA/AML compliance, fair lending practices, and cybersecurity risk management. On-site examination team arriving in 48 hours. 6 departments must produce comprehensive documentation.' },
    aiInsights: [
      '3 of 6 requested document categories have gaps — BSA transaction monitoring logs need 72-hour reconstruction',
      'Last OCC examination (18 months ago) had 2 findings — verify remediation evidence is complete',
      'Fair lending analysis: 4 statistical models need updated disparate impact testing results',
      'Cybersecurity documentation: SOC 2 Type II report current, but penetration test results are 90 days old',
    ],
    stakeholders: [
      { name: 'Sarah Chen', role: 'CFO', responseTime: '1 min 5 sec' },
      { name: 'Emily Taylor', role: 'Chief Legal Officer', responseTime: '52 seconds' },
      { name: 'Robert Kim', role: 'CISO', responseTime: '38 seconds' },
      { name: 'Eric Green', role: 'Director of Audit', responseTime: '28 seconds' },
      { name: 'Angela Baker', role: 'Director of Analytics', responseTime: '1 min 45 sec' },
      { name: 'Gregory Adams', role: 'VP Investor Relations', responseTime: '2 min 20 sec' },
    ],
    executionTasks: [
      { task: 'Document retrieval initiated across 6 departments', tool: 'AuditBoard', status: 'Complete', time: '0:30' },
      { task: 'BSA transaction monitoring log reconstruction started', tool: 'LogicGate', status: 'Complete', time: '1:00' },
      { task: 'Previous examination findings remediation evidence compiled', tool: 'MetricStream', status: 'Complete', time: '2:00' },
      { task: 'Fair lending statistical analysis updated', tool: 'Snowflake + Python', status: 'Complete', time: '3:00' },
      { task: 'Cybersecurity documentation package assembled', tool: 'ServiceNow', status: 'Complete', time: '4:30' },
      { task: 'Examination room prepared with secure document access', tool: 'Microsoft Teams', status: 'Complete', time: '6:00' },
      { task: 'Mock examination walkthrough completed', tool: 'Zoom', status: 'Complete', time: '8:00' },
      { task: '20 stakeholders coordinated, audit-ready in 47 hours', tool: 'ExecuteIQ', status: 'Complete', time: '10:15' },
    ],
    outcomes: [
      { metric: 'Time to Audit Readiness', before: '10+ days', after: '47 hours (within 48-hour deadline)' },
      { metric: 'Document Completeness', before: 'Unknown', after: '98.5% — 3 minor gaps identified and disclosed' },
      { metric: 'Team Coordination', before: 'Multiple meetings', after: 'Single coordinated response' },
      { metric: 'Examination Result', before: 'Stressful', after: 'Zero new findings, 2 prior findings closed' },
    ],
    lesson: 'Playbook refined: Created "Standing Audit Readiness" mode that maintains continuous document freshness. Added "Penetration Test Staleness" alert — auto-triggers at 60 days instead of waiting for examination notice. Linked to Cybersecurity playbook for coordinated documentation updates.',
  },
  cso: {
    id: 'cso', title: 'Chief Strategy Officer', name: 'Patricia Wright', company: 'Meridian Financial Group',
    icon: Target, color: 'text-violet-400', gradient: 'from-violet-600 to-purple-700',
    scenario: 'Strategic Pivot — Market Entry into Asia-Pacific Financial Services',
    domain: 'Market Entry', domainCategory: 'OFFENSE',
    playbook: { number: '15', name: 'New Market Entry — APAC Financial Services', tasks: 40, stakeholders: 38, budget: '$3.2M' },
    triggers: [
      { name: 'Market Opportunity Score Threshold', source: 'McKinsey Market Data + Internal Analytics', type: 'Automated Strategic' },
      { name: 'Competitive Intelligence Alert', source: 'Crayon + Klue', type: 'Automated Competitive' },
      { name: 'Board Strategy Resolution', source: 'Board Portal', type: 'Manual Executive Trigger' },
    ],
    dataSources: [
      { name: 'McKinsey Market Intelligence', status: 'Connected', dataPoints: 6800 },
      { name: 'Crayon Competitive Intel', status: 'Connected', dataPoints: 3200 },
      { name: 'Pitchbook Market Data', status: 'Connected', dataPoints: 4500 },
      { name: 'Internal Strategy Analytics', status: 'Connected', dataPoints: 2100 },
    ],
    customizations: [
      { field: 'Entry Model', before: 'Single model', after: 'Multi-track evaluation: organic growth, JV, acquisition, licensing with scoring matrix' },
      { field: 'Timeline', before: '18-month waterfall', after: '12-month agile sprints with quarterly market validation gates' },
      { field: 'Risk Assessment', before: 'Binary go/no-go', after: 'Probabilistic: Monte Carlo simulation with 5 risk scenarios' },
      { field: 'Stakeholder Governance', before: 'Monthly reviews', after: 'Weekly sprints with daily standups for workstream leads' },
    ],
    signal: { name: 'APAC Market Entry Window — Competitor Withdrawal Creates Strategic Opening', severity: 'HIGH', source: 'Crayon Competitive Intel + McKinsey Market Data', detail: 'Major competitor announced withdrawal from Singapore and Hong Kong markets citing regulatory challenges. Combined addressable market of $340M now available. Local regulatory approval timeline: 6-9 months. Two potential JV partners have expressed interest. Window estimated at 90-120 days before secondary competitors fill the gap.' },
    aiInsights: [
      '$340M addressable market with 23% CAGR — projected Meridian capture: $48M in Year 2',
      'Two JV partners identified: Asia Pacific Financial Group (stronger regulatory) and Pacific Rim Capital (stronger distribution)',
      'Regulatory path analysis: Singapore MAS license 6 months, Hong Kong SFC license 9 months — recommend parallel applications',
      'Risk assessment: 78% probability of successful entry with JV model, 45% with organic growth',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '1 min 45 sec' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '2 min 10 sec' },
      { name: 'Emily Taylor', role: 'CLO', responseTime: '1 min 55 sec' },
      { name: 'Ryan Davis', role: 'VP Sales', responseTime: '2 min 30 sec' },
      { name: 'Lisa Anderson', role: 'CMO', responseTime: '2 min 45 sec' },
      { name: 'David Wilson', role: 'COO', responseTime: '3 min 5 sec' },
      { name: 'Michael Rodriguez', role: 'CTO', responseTime: '1 min 30 sec' },
      { name: 'Gregory Adams', role: 'VP Investor Relations', responseTime: '3 min 30 sec' },
    ],
    executionTasks: [
      { task: 'Market entry business case finalized with 3 scenarios', tool: 'Google Workspace', status: 'Complete', time: '0:30' },
      { task: 'JV partner due diligence initiated', tool: 'Jira + Salesforce', status: 'Complete', time: '1:30' },
      { task: 'Regulatory application packages prepared for MAS + SFC', tool: 'ServiceNow', status: 'Complete', time: '2:30' },
      { task: 'Local team hiring plan created for Singapore office', tool: 'Workday', status: 'Complete', time: '4:00' },
      { task: 'Technology infrastructure requirements scoped for APAC', tool: 'AWS + Jira', status: 'Complete', time: '5:30' },
      { task: 'Customer pipeline development started with 22 target accounts', tool: 'Salesforce', status: 'Complete', time: '7:00' },
      { task: 'Board presentation with recommendation prepared', tool: 'Google Workspace', status: 'Complete', time: '9:00' },
      { task: '38 stakeholders coordinated, APAC entry program live', tool: 'ExecuteIQ', status: 'Complete', time: '11:45' },
    ],
    outcomes: [
      { metric: 'Time to Market Entry Launch', before: '3 months', after: '11 minutes 45 seconds' },
      { metric: 'Strategic Window Response', before: 'Often missed', after: 'Captured within 48 hours of opportunity' },
      { metric: 'Cross-Functional Alignment', before: '6-8 weeks', after: 'Same day' },
      { metric: 'Projected Year 2 Revenue', before: 'Unknown', after: '$48M with 78% confidence' },
    ],
    lesson: 'Playbook enhanced: Added "Competitive Withdrawal Monitor" as a new trigger source — catches market gaps 2-3 weeks faster. Created reusable "JV Partner Evaluation Scorecard" template. Linked Market Entry playbook to Regulatory Compliance playbook for parallel processing.',
  },
  cro: {
    id: 'cro', title: 'Chief Revenue Officer', name: 'Ryan Davis', company: 'Meridian Financial Group',
    icon: TrendingUp, color: 'text-emerald-400', gradient: 'from-emerald-600 to-teal-700',
    scenario: 'Revenue Protection — Major Enterprise Customer Churn Prevention',
    domain: 'Competitive Response', domainCategory: 'OFFENSE',
    playbook: { number: '52', name: 'Enterprise Customer Retention — Critical Account', tasks: 28, stakeholders: 22, budget: '$200K' },
    triggers: [
      { name: 'Customer Health Score Drop', source: 'Gainsight + Salesforce', type: 'Automated Customer Success' },
      { name: 'Competitive Displacement Alert', source: 'Gong + Salesforce', type: 'Automated Competitive' },
      { name: 'Account Manager Escalation', source: 'Salesforce + Slack', type: 'Manual Sales Trigger' },
    ],
    dataSources: [
      { name: 'Gainsight Customer Health', status: 'Connected', dataPoints: 8900 },
      { name: 'Salesforce CRM', status: 'Connected', dataPoints: 14200 },
      { name: 'Gong Conversation Intelligence', status: 'Connected', dataPoints: 4500 },
      { name: 'ZoomInfo Intent Data', status: 'Connected', dataPoints: 3200 },
    ],
    customizations: [
      { field: 'Risk Scoring', before: 'Simple RAG', after: 'Multi-factor: usage trends, support tickets, NPS, contract terms, competitive mentions, stakeholder changes' },
      { field: 'Intervention Tiers', before: 'Single playbook', after: '3-tier: Proactive (score 60-80), Reactive (40-60), Emergency (below 40)' },
      { field: 'Account Team Assembly', before: 'Standard CSM', after: 'War room: CSM, AE, SE, Product, Executive Sponsor, Professional Services' },
      { field: 'Communication Cadence', before: 'Quarterly review', after: 'Weekly touchpoints, bi-weekly exec alignment, daily monitoring during intervention' },
    ],
    signal: { name: 'Critical Account Risk — $4.2M Enterprise Customer Evaluating Competitor', severity: 'CRITICAL', source: 'Gainsight Health Score Drop + Gong Competitive Mention + ZoomInfo Intent', detail: 'Top 10 account Titan Industries ($4.2M ARR) health score dropped from 82 to 41 in 30 days. Gong detected 3 calls mentioning competitor evaluation. ZoomInfo shows intent signals for competitor product pages. Contract renewal in 90 days. 4 key stakeholders changed roles in past quarter.' },
    aiInsights: [
      '$4.2M ARR at risk — cascading impact: 3 other accounts in same industry watching this decision',
      'Root cause: 4 stakeholder changes in 90 days — new CTO is former competitor customer',
      'Product gap: customer requested 2 features in our roadmap but delivery timeline uncertain',
      'Win probability if no action: 35% — with intervention: 78% based on similar recovery patterns',
    ],
    stakeholders: [
      { name: 'Jennifer Park', role: 'CEO', responseTime: '2 min 15 sec' },
      { name: 'Lisa Anderson', role: 'CMO', responseTime: '1 min 45 sec' },
      { name: 'Amanda Jackson', role: 'VP Customer Success', responseTime: '48 seconds' },
      { name: 'Laura Lewis', role: 'VP Product', responseTime: '1 min 22 sec' },
      { name: 'Daniel Chen', role: 'Enterprise AE', responseTime: '32 seconds' },
      { name: 'Sarah Chen', role: 'CFO', responseTime: '3 min 5 sec' },
    ],
    executionTasks: [
      { task: 'Executive sponsor outreach to Titan Industries CEO', tool: 'Email + Phone', status: 'Complete', time: '0:30' },
      { task: 'Account recovery war room assembled', tool: 'Slack + Zoom', status: 'Complete', time: '1:00' },
      { task: 'Product roadmap acceleration review for requested features', tool: 'Jira', status: 'Complete', time: '2:00' },
      { task: 'Custom retention proposal with commercial incentives prepared', tool: 'Salesforce + Google Workspace', status: 'Complete', time: '3:30' },
      { task: 'Competitive displacement analysis generated', tool: 'Gong + Crayon', status: 'Complete', time: '4:30' },
      { task: 'Executive business review scheduled with full C-suite attendance', tool: 'Microsoft Teams', status: 'Complete', time: '6:00' },
      { task: 'Customer success plan updated with weekly touchpoints', tool: 'Gainsight', status: 'Complete', time: '7:30' },
      { task: '22 stakeholders coordinated, retention campaign live', tool: 'ExecuteIQ', status: 'Complete', time: '10:55' },
    ],
    outcomes: [
      { metric: 'Time to Intervention', before: '2-3 weeks', after: '10 minutes 55 seconds' },
      { metric: 'Customer Save Rate', before: '62%', after: '94% with ExecuteIQ intervention' },
      { metric: 'Revenue Protected', before: '$4.2M at risk', after: '$4.2M retained + $800K expansion identified' },
      { metric: 'Cascade Impact', before: '3 industry accounts stabilized', after: 'Same messaging deployed' },
    ],
    lesson: 'Playbook refined: Added "Stakeholder Change Monitor" as a leading indicator — catches executive turnover risk 30 days earlier. Created reusable "Competitive Displacement Response" template. Updated risk scoring to weight stakeholder changes 2x higher than previous model.',
  },
};

const FALLBACK_ROLE = ROLES.ciso;

const STAGES = [
  { id: 'intro', label: 'Your Scenario' },
  { id: 'playbook', label: 'Build Playbook' },
  { id: 'triggers', label: 'Configure Triggers' },
  { id: 'data', label: 'Connect Data' },
  { id: 'customize', label: 'Customize' },
  { id: 'signal', label: 'Signal Fires' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'decision', label: 'Your Decision' },
  { id: 'activation', label: 'Execution' },
  { id: 'warroom', label: 'War Room' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'learning', label: 'Learning' },
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-indigo-500' : 'bg-white/10'} ${i === step ? 'h-1.5' : ''}`} />
      ))}
    </div>
  );
}

export default function RoleExperience() {
  const params = useParams<{ roleId: string }>();
  const roleId = params?.roleId || 'ciso';
  const role = ROLES[roleId] || FALLBACK_ROLE;
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
      name: role.playbook.name,
      tasks: role.playbook.tasks,
      stakeholders: role.playbook.stakeholders,
      budget: role.playbook.budget,
    });
    setUserTriggers(role.triggers.map(t => ({ name: t.name, source: t.source, type: t.type, enabled: true })));
    setUserDataSources(role.dataSources.map(d => ({ name: d.name, connected: true, dataPoints: d.dataPoints })));
    setUserCustomizations(role.customizations.map(c => ({ field: c.field, value: c.after })));
    setCustomTasks([]);
    setNewTaskInput('');
    setConfigComplete(false);
    setShowSummary(false);
    setStage(0);
    setActivationStep(0);
  }, [roleId]);

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
      return;
    }
    if (currentId === 'customize' && showSummary) {
      setShowSummary(false);
    }
    setStage(prev => Math.min(prev + 1, STAGES.length - 1));
  }, [stage, showSummary]);
  const prev = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    setStage(prev => Math.max(prev - 1, 0));
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
      const totalTasks = role.executionTasks.length + customTasks.length;
      const interval = setInterval(() => {
        setActivationStep(prev => (prev < totalTasks - 1 ? prev + 1 : prev));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage, role.executionTasks.length, customTasks.length]);

  const Icon = role.icon;
  const currentStage = STAGES[stage];

  const allExecutionTasks = useMemo(() => {
    const base = [...role.executionTasks];
    customTasks.forEach((task, i) => {
      base.push({ task, tool: 'Custom', status: 'Complete', time: `${9 + i}:00` });
    });
    return base;
  }, [role.executionTasks, customTasks]);

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
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Configuration Summary</h2>
            <p className="text-slate-300">Review your setup before launching the execution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Your Playbook</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-300">Name</span><span className="text-white font-medium">{userPlaybook.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Tasks</span><span className="text-white font-medium">{userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''}</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Stakeholders</span><span className="text-white font-medium">{userPlaybook.stakeholders}</span></div>
                <div className="flex justify-between"><span className="text-slate-300">Budget</span><span className="text-white font-medium">{userPlaybook.budget}</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-white">Active Triggers</h3>
              </div>
              <div className="space-y-2">
                {enabledTriggers.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-slate-300">{t.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Connected Data Sources</h3>
              </div>
              <div className="space-y-2">
                {connectedSources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-indigo-400 font-medium">{s.dataPoints.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm">
                <span className="text-slate-300">Total Monitoring</span>
                <span className="text-white font-bold">{totalDataPoints.toLocaleString()} data points</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-white">Customizations</h3>
              </div>
              <div className="space-y-2">
                {userCustomizations.filter(c => c.value.trim()).map((c, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-slate-300">{c.field}: </span>
                    <span className="text-slate-300">{c.value.slice(0, 60)}{c.value.length > 60 ? '...' : ''}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-center">
            <Button onClick={next} size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-6 text-lg">
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
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mx-auto mb-6`}>
                <Icon className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Badge className={`mb-4 ${role.domainCategory === 'OFFENSE' ? 'bg-blue-500/20 text-blue-400' : role.domainCategory === 'DEFENSE' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>{role.domainCategory} — {role.domain}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{role.name}, {role.title}</h1>
              <p className="text-xl text-slate-300 mb-2">{role.company}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-8 bg-slate-900/80 border border-white/10 rounded-2xl p-8"
            >
              <div className="text-sm text-slate-300 uppercase tracking-wider mb-3">Today's Scenario</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{role.scenario}</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Configure your own playbook, triggers, data sources, and customizations. Then watch your personalized execution come alive as a real signal fires.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-300"
            >
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-400" /> Playbook #{role.playbook.number}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-400" /> {role.playbook.stakeholders} stakeholders</span>
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-amber-400" /> {role.playbook.tasks} tasks</span>
              <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-400" /> {role.playbook.budget} budget</span>
            </motion.div>
          </div>
        );

      case 'playbook':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-cyan-500/20 text-cyan-400"><BookOpen className="h-3 w-3 mr-1" /> BUILD YOUR PLAYBOOK</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Build Your Playbook</h2>
              <p className="text-slate-300">Customize your playbook configuration — pre-filled with smart defaults from {role.title}</p>
            </div>
            {configComplete && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <CheckCircle2 className="h-4 w-4 text-green-400 inline mr-2" />
                <span className="text-sm text-green-400 font-medium">Configuration Complete — All 4 setup stages have data</span>
              </motion.div>
            )}
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-slate-300 font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-cyan-950/30 border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                  <span className="text-white font-semibold">Playbook Configuration</span>
                  <Badge variant="outline" className="text-xs">Template #{role.playbook.number}</Badge>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pb-name" className="text-slate-300">Playbook Name</Label>
                    <Input id="pb-name" value={userPlaybook.name}
                      onChange={e => setUserPlaybook(p => ({ ...p, name: e.target.value }))}
                      placeholder={role.playbook.name}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-budget" className="text-slate-300">Budget</Label>
                    <Input id="pb-budget" value={userPlaybook.budget}
                      onChange={e => setUserPlaybook(p => ({ ...p, budget: e.target.value }))}
                      placeholder={role.playbook.budget}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-tasks" className="text-slate-300">Number of Tasks</Label>
                    <Input id="pb-tasks" type="number" value={userPlaybook.tasks}
                      onChange={e => setUserPlaybook(p => ({ ...p, tasks: parseInt(e.target.value) || 0 }))}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pb-stakeholders" className="text-slate-300">Stakeholder Count</Label>
                    <Input id="pb-stakeholders" type="number" value={userPlaybook.stakeholders}
                      onChange={e => setUserPlaybook(p => ({ ...p, stakeholders: parseInt(e.target.value) || 0 }))}
                      className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="text-xs text-slate-300 uppercase tracking-wider mb-3">Task Sequence (from template)</div>
                  <div className="space-y-2 mb-4">
                    {role.executionTasks.slice(0, 5).map((task, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400 font-bold">{i + 1}</div>
                        <span className="text-sm text-slate-300 flex-1">{task.task}</span>
                        <Badge variant="outline" className="text-[10px]">{task.tool}</Badge>
                      </div>
                    ))}
                    {role.executionTasks.length > 5 && (
                      <div className="text-center text-xs text-slate-300 py-1">+ {role.executionTasks.length - 5} more template tasks</div>
                    )}
                  </div>
                  {customTasks.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">Your Custom Tasks</div>
                      <div className="space-y-2">
                        {customTasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3">
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-[10px]">Custom</Badge>
                            <span className="text-sm text-white flex-1">{task}</span>
                            <button onClick={() => setCustomTasks(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400">
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
                      className="bg-white/5 border-white/10 text-white flex-1"
                      onKeyDown={e => { if (e.key === 'Enter' && newTaskInput.trim()) { setCustomTasks(prev => [...prev, newTaskInput.trim()]); setNewTaskInput(''); }}} />
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-400"
                      onClick={() => { if (newTaskInput.trim()) { setCustomTasks(prev => [...prev, newTaskInput.trim()]); setNewTaskInput(''); }}}>
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mt-6 flex justify-end">
              <Button onClick={next} disabled={!userPlaybook.name.trim()} className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white px-8">
                Next: Configure Triggers <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'triggers':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-amber-500/20 text-amber-400"><Radio className="h-3 w-3 mr-1" /> CONFIGURE TRIGGERS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Configure Your Triggers</h2>
              <p className="text-slate-300">Set up the conditions that will automatically activate your playbook</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-slate-300 font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <div className="space-y-4 mb-6">
              {userTriggers.map((trigger, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                  className={`bg-slate-900/80 border rounded-2xl p-6 ${trigger.enabled ? 'border-amber-500/20' : 'border-white/5 opacity-60'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${trigger.enabled ? 'bg-amber-500/20' : 'bg-white/5'} flex items-center justify-center`}>
                        <Radio className={`h-5 w-5 ${trigger.enabled ? 'text-amber-400' : 'text-slate-300'}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={trigger.enabled}
                          onCheckedChange={checked => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, enabled: checked } : t))} />
                        <span className={`text-xs ${trigger.enabled ? 'text-green-400' : 'text-slate-300'}`}>{trigger.enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                    <button onClick={() => setUserTriggers(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Trigger Name</Label>
                      <Input value={trigger.name}
                        onChange={e => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, name: e.target.value } : t))}
                        className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Data Source</Label>
                      <Input value={trigger.source}
                        onChange={e => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, source: e.target.value } : t))}
                        className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-300 text-xs">Type</Label>
                      <Select value={trigger.type.includes('Manual') ? 'Manual' : trigger.type.includes('Hybrid') ? 'Hybrid' : 'Automated'}
                        onValueChange={val => setUserTriggers(prev => prev.map((t, j) => j === i ? { ...t, type: val } : t))}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Automated">Automated</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="border-amber-500/30 text-amber-400 mb-6"
              onClick={() => setUserTriggers(prev => [...prev, { name: '', source: '', type: 'Automated', enabled: true }])}>
              <Plus className="h-4 w-4 mr-1" /> Add Trigger
            </Button>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-white/20 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} disabled={enabledTriggers.length === 0} className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8">
                Next: Connect Data <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-indigo-500/20 text-indigo-400"><Database className="h-3 w-3 mr-1" /> CONNECT DATA SOURCES</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Connect Your Data Sources</h2>
              <p className="text-slate-300">Toggle connections to enterprise systems that feed real-time intelligence</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-slate-300 font-medium">{setupReadiness.percent}% ready</span>
            </div>
            <div className="bg-slate-900/60 border border-indigo-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-white font-medium">Total Data Points Monitored</span>
              </div>
              <div className="text-2xl font-bold text-indigo-400">{totalDataPoints.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {userDataSources.map((source, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.1 }}
                  className={`bg-slate-900/80 border rounded-xl p-5 ${source.connected ? 'border-green-500/20' : 'border-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Workflow className={`h-5 w-5 ${source.connected ? 'text-indigo-400' : 'text-slate-300'}`} />
                      {i < role.dataSources.length ? (
                        <span className="text-sm font-medium text-white">{source.name}</span>
                      ) : (
                        <Input value={source.name}
                          onChange={e => setUserDataSources(prev => prev.map((d, j) => j === i ? { ...d, name: e.target.value } : d))}
                          className="bg-white/5 border-white/10 text-white h-8 text-sm w-48" placeholder="Source name" />
                      )}
                    </div>
                    <button onClick={() => setUserDataSources(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={source.connected} onCheckedChange={() => handleToggleDataSource(i)} />
                      {connectingIdx === i ? (
                        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}
                          className="text-xs text-amber-400">Connecting...</motion.span>
                      ) : source.connected ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">Disconnected</span>
                      )}
                    </div>
                    {source.connected && (
                      <span className="text-sm font-bold text-indigo-400">{source.dataPoints.toLocaleString()} pts</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <Input value={newDataSourceName} onChange={e => setNewDataSourceName(e.target.value)}
                placeholder="Add a custom data source..."
                className="bg-white/5 border-white/10 text-white flex-1"
                onKeyDown={e => { if (e.key === 'Enter' && newDataSourceName.trim()) {
                  setUserDataSources(prev => [...prev, { name: newDataSourceName.trim(), connected: false, dataPoints: Math.floor(Math.random() * 5000) + 500 }]);
                  setNewDataSourceName('');
                }}} />
              <Button variant="outline" className="border-indigo-500/30 text-indigo-400"
                onClick={() => { if (newDataSourceName.trim()) {
                  setUserDataSources(prev => [...prev, { name: newDataSourceName.trim(), connected: false, dataPoints: Math.floor(Math.random() * 5000) + 500 }]);
                  setNewDataSourceName('');
                }}}>
                <Plus className="h-4 w-4 mr-1" /> Add Data Source
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-white/20 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} disabled={connectedSources.length === 0} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8">
                Next: Customize <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-purple-500/20 text-purple-400"><Sliders className="h-3 w-3 mr-1" /> CUSTOMIZE CONFIGURATION</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Customize Your Configuration</h2>
              <p className="text-slate-300">Fine-tune each setting — leave blank to use the smart default</p>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <Progress value={setupReadiness.percent} className="h-2 flex-1" />
              <span className="text-xs text-slate-300 font-medium">{setupReadiness.percent}% ready</span>
            </div>
            {configComplete && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <CheckCircle2 className="h-4 w-4 text-green-400 inline mr-2" />
                <span className="text-sm text-green-400 font-medium">Configuration Complete — Ready to launch execution</span>
              </motion.div>
            )}
            <div className="space-y-4 mb-6">
              {userCustomizations.map((custom, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white font-medium">{custom.field}</Label>
                    {i >= role.customizations.length && (
                      <button onClick={() => setUserCustomizations(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {i < role.customizations.length && (
                    <div className="text-xs text-slate-300 mb-2">
                      Default: <span className="text-slate-300">{role.customizations[i].before}</span> → <span className="text-purple-400">{role.customizations[i].after}</span>
                    </div>
                  )}
                  <Textarea value={custom.value}
                    onChange={e => setUserCustomizations(prev => prev.map((c, j) => j === i ? { ...c, value: e.target.value } : c))}
                    placeholder={i < role.customizations.length ? role.customizations[i].after : 'Enter your custom configuration...'}
                    className="bg-white/5 border-white/10 text-white min-h-[60px]" />
                  {custom.value.trim() && custom.value !== (i < role.customizations.length ? role.customizations[i].after : '') && (
                    <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 text-[10px]">Your Configuration</Badge>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <Input value={newCustomField} onChange={e => setNewCustomField(e.target.value)}
                placeholder="Add a custom setting name..."
                className="bg-white/5 border-white/10 text-white flex-1"
                onKeyDown={e => { if (e.key === 'Enter' && newCustomField.trim()) {
                  setUserCustomizations(prev => [...prev, { field: newCustomField.trim(), value: '' }]);
                  setNewCustomField('');
                }}} />
              <Button variant="outline" className="border-purple-500/30 text-purple-400"
                onClick={() => { if (newCustomField.trim()) {
                  setUserCustomizations(prev => [...prev, { field: newCustomField.trim(), value: '' }]);
                  setNewCustomField('');
                }}}>
                <Plus className="h-4 w-4 mr-1" /> Add Custom Setting
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prev} className="border-white/20 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={next} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8">
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
                className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                SIGNAL DETECTED
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Trigger Fires</h2>
              <p className="text-slate-300">Your configured trigger has detected a real event</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-slate-900/80 border border-red-500/30 rounded-2xl overflow-hidden"
            >
              <div className="bg-red-950/50 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </motion.div>
                  <span className="text-red-400 font-semibold">{role.signal.severity} SIGNAL</span>
                </div>
                <Badge className="bg-red-500 text-white">{role.signal.severity}</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{role.signal.name}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{role.signal.detail}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <Eye className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-300">Source</div>
                    <div className="text-sm text-white font-medium">{role.signal.source}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <BookOpen className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-300">Your Playbook</div>
                    <div className="text-sm text-white font-medium">{userPlaybook.name}</div>
                    {userPlaybook.name !== role.playbook.name && <Badge className="mt-1 bg-cyan-500/20 text-cyan-400 text-[8px]">Custom</Badge>}
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <Bell className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-300">Stakeholders Ready</div>
                    <div className="text-sm text-white font-medium">{userPlaybook.stakeholders} identified</div>
                  </div>
                </div>
                {enabledTriggers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-slate-300 mb-2">Your Active Triggers</div>
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
              <Badge className="mb-3 bg-purple-500/20 text-purple-400"><Brain className="h-3 w-3 mr-1" /> AI ANALYSIS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Analyzes the Situation</h2>
              <p className="text-slate-300">GPT-4o processes {totalDataPoints.toLocaleString()} data points from your connected sources</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Key Insights</h3>
                </div>
                <div className="space-y-3">
                  {role.aiInsights.map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
                      className="flex items-start gap-3 bg-white/5 rounded-lg p-3"
                    >
                      <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">AI Confidence</h3>
                  <div className="flex items-end gap-4 mb-4">
                    <div className="text-5xl font-bold text-purple-400">94%</div>
                    <div className="text-sm text-slate-300 pb-2">recommendation confidence</div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ delay: 0.8, duration: 1.5 }}
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                  className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">AI Recommendation</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "Activate <span className="text-white font-semibold">{userPlaybook.name}</span> immediately. 
                    {userPlaybook.stakeholders} stakeholders identified, {userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''} tasks pre-configured, {userPlaybook.budget} budget pre-approved."
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
              <Badge className="mb-3 bg-indigo-500/20 text-indigo-400"><Shield className="h-3 w-3 mr-1" /> HUMAN-AI PARTNERSHIP</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{role.name.split(' ')[0]} Makes the Call</h2>
              <p className="text-slate-300">AI recommends. The executive decides. Always.</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-8"
            >
              <div className="flex items-center gap-5 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{role.name}</h3>
                  <p className="text-slate-300">{role.title}, {role.company}</p>
                </div>
              </div>
              <div className="bg-indigo-950/30 border border-indigo-500/10 rounded-xl p-5 mb-6">
                <div className="text-xs text-indigo-400 uppercase tracking-wider mb-2">Decision Required</div>
                <p className="text-slate-300">
                  Activate <span className="text-white font-semibold">{userPlaybook.name}</span> with {userPlaybook.stakeholders} stakeholders, 
                  {' '}{userPlaybook.tasks}{customTasks.length > 0 ? ` + ${customTasks.length} custom` : ''} pre-configured tasks, and {userPlaybook.budget} pre-approved budget?
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-cyan-400">{userPlaybook.tasks + customTasks.length}</div>
                  <div className="text-xs text-slate-300">Tasks Ready</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-400">{userPlaybook.stakeholders}</div>
                  <div className="text-xs text-slate-300">Stakeholders Mapped</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400">{userPlaybook.budget}</div>
                  <div className="text-xs text-slate-300">Budget Pre-Approved</div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-3 bg-green-500/20 border border-green-500/30 text-green-400 px-8 py-4 rounded-xl font-semibold text-lg"
              >
                <CheckCircle2 className="h-6 w-6" />
                APPROVED — {role.name.split(' ')[0]} Activates {userPlaybook.name}
              </motion.div>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="text-center text-sm text-slate-300 mt-6"
            >
              Every activation requires human approval. ExecuteIQ accelerates the process — humans retain full decision authority.
            </motion.p>
          </div>
        );

      case 'activation':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <Badge className="mb-3 bg-green-500/20 text-green-400"><Zap className="h-3 w-3 mr-1" /> EXECUTE PHASE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">12-Minute Execution in Progress</h2>
              <p className="text-slate-300">Watch as tasks auto-create, stakeholders coordinate, and systems activate</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 bg-slate-900/80 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Execution Timeline</h3>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400 text-xs font-medium">LIVE</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {allExecutionTasks.map((task, i) => {
                    const isActive = i <= activationStep;
                    const isCurrent = i === activationStep;
                    const isCustom = i >= role.executionTasks.length;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: isActive ? 1 : 0.25, x: isActive ? 0 : -20 }}
                        className={`flex items-center gap-3 p-2.5 rounded-lg ${isCurrent ? 'bg-green-500/10 ring-1 ring-green-500/20' : ''}`}
                      >
                        <div className="w-12 text-right font-mono text-xs text-slate-300">{task.time}</div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-green-500/20' : 'bg-white/5'}`}>
                          <CheckCircle2 className={`h-3 w-3 ${isActive ? 'text-green-400' : 'text-slate-700'}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{task.task}</div>
                        </div>
                        {isCustom && <Badge className="bg-cyan-500/20 text-cyan-400 text-[8px]">Custom</Badge>}
                        <Badge variant="outline" className={`text-[10px] ${isActive ? '' : 'opacity-30'}`}>{task.tool}</Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="bg-slate-900/80 border border-blue-500/20 rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-3 text-sm">Stakeholder Response</h3>
                  <div className="space-y-2">
                    {role.stakeholders.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: i <= activationStep ? 1 : 0.2 }} transition={{ delay: i * 0.3 }}
                        className="flex items-center justify-between bg-white/5 rounded-lg p-2.5"
                      >
                        <div>
                          <div className="text-xs text-white font-medium">{s.name}</div>
                          <div className="text-[10px] text-slate-300">{s.role}</div>
                        </div>
                        {i <= activationStep && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                            <span className="text-[10px] text-green-400">{s.responseTime}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-3 text-sm">Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Tasks</span>
                        <span className="text-green-400">{Math.min(activationStep + 1, allExecutionTasks.length)}/{allExecutionTasks.length}</span>
                      </div>
                      <Progress value={((activationStep + 1) / allExecutionTasks.length) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Stakeholders</span>
                        <span className="text-blue-400">{Math.min(activationStep + 1, role.stakeholders.length)}/{userPlaybook.stakeholders}</span>
                      </div>
                      <Progress value={((Math.min(activationStep + 1, role.stakeholders.length)) / userPlaybook.stakeholders) * 100} className="h-2" />
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
              <Badge className="mb-3 bg-blue-500/20 text-blue-400"><MessageSquare className="h-3 w-3 mr-1" /> WAR ROOM</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cross-Functional War Room</h2>
              <p className="text-slate-300">All stakeholders coordinating in real-time through a unified command center</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900/80 border border-blue-500/20 rounded-2xl overflow-hidden"
            >
              <div className="bg-blue-950/30 border-b border-blue-500/10 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-medium text-sm">War Room — {userPlaybook.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span>{userPlaybook.stakeholders} participants</span>
                  <span>4 channels active</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: role.stakeholders[0]?.name || 'Team Lead', role: role.stakeholders[0]?.role || 'Director', msg: `Team is assembled. All ${userPlaybook.tasks + customTasks.length} tasks distributed and acknowledged. Execution is on track.`, time: '2 min ago', color: 'border-green-500/30' },
                  { name: 'ExecuteIQ AI', role: 'AI Assistant', msg: `Status update: ${Math.floor(userPlaybook.stakeholders * 0.8)} of ${userPlaybook.stakeholders} stakeholders have acknowledged. ${allExecutionTasks.length} tasks in progress. No blockers detected. Estimated completion: under 12 minutes.`, time: '1 min ago', color: 'border-purple-500/30' },
                  { name: role.stakeholders[1]?.name || 'Executive', role: role.stakeholders[1]?.role || 'VP', msg: `Confirmed all systems are operational on our end. ${userPlaybook.budget} budget allocation is active and tracking. Ready to support any escalations.`, time: '30 sec ago', color: 'border-blue-500/30' },
                ].map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.3 }}
                    className={`border-l-2 ${msg.color} bg-white/5 rounded-r-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{msg.name}</span>
                        <Badge variant="outline" className="text-[10px]">{msg.role}</Badge>
                      </div>
                      <span className="text-[10px] text-slate-300">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-300">{msg.msg}</p>
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
              <Badge className="mb-3 bg-green-500/20 text-green-400"><Award className="h-3 w-3 mr-1" /> RESULTS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Mission Complete</h2>
              <p className="text-slate-300">{role.name.split(' ')[0]}'s results using ExecuteIQ vs. traditional approach</p>
            </div>
            <div className="space-y-4 mb-8">
              {role.outcomes.map((outcome, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }}
                  className="bg-slate-900/80 border border-white/10 rounded-xl p-5"
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-white font-semibold">{outcome.metric}</div>
                    <div className="text-center">
                      <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Without ExecuteIQ</div>
                      <div className="text-lg font-bold text-red-400">{outcome.before}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-green-400 uppercase tracking-wider mb-1">With ExecuteIQ</div>
                      <div className="text-lg font-bold text-green-400">{outcome.after}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="bg-gradient-to-r from-green-950/30 to-emerald-950/30 border border-green-500/20 rounded-2xl p-6 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Full execution completed in under 12 minutes</h3>
              <p className="text-slate-300">{userPlaybook.stakeholders} stakeholders coordinated, {userPlaybook.tasks + customTasks.length} tasks completed, {userPlaybook.budget} budget tracked</p>
            </motion.div>
          </div>
        );

      case 'learning':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-purple-500/20 text-purple-400"><TrendingUp className="h-3 w-3 mr-1" /> ADVANCE PHASE</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Institutional Learning</h2>
              <p className="text-slate-300">{role.name.split(' ')[0]}'s execution data feeds back into the playbook for continuous improvement</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">AI-Generated Playbook Refinement</h3>
              </div>
              <div className="bg-purple-950/20 border border-purple-500/10 rounded-xl p-5">
                <p className="text-slate-300 leading-relaxed">{role.lesson}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { label: 'Execution Score', value: '96/100', icon: Award, color: 'text-green-400' },
                { label: 'Improvement Areas', value: '3 identified', icon: Lightbulb, color: 'text-amber-400' },
                { label: 'Playbook Version', value: 'v2.1 saved', icon: BookOpen, color: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                  <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-300">{item.label}</div>
                </div>
              ))}
            </motion.div>
            {customTasks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-5 mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Your Custom Tasks</Badge>
                  <span className="text-sm text-slate-300">incorporated into playbook v2.1</span>
                </div>
                <div className="space-y-1">
                  {customTasks.map((t, i) => (
                    <div key={i} className="text-sm text-slate-300">• {t}</div>
                  ))}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-center space-y-4"
            >
              <p className="text-slate-300">Every execution makes the next one faster, smarter, and more effective.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/role-selector">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Try Another Role
                  </Button>
                </Link>
                <Link href="/pilot-program">
                  <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
                    <Rocket className="h-4 w-4 mr-2" /> Start Your Pilot
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Link href="/role-selector">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" /> Roles
              </Button>
            </Link>
            <div className="flex-1">
              <StepIndicator step={stage} total={STAGES.length} />
            </div>
            <span className="text-xs text-slate-300 font-medium min-w-[80px] text-center">{stage + 1}/{STAGES.length} — {currentStage.label}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={prev} disabled={stage === 0 && !showSummary} className="text-slate-300 hover:text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={next} disabled={stage === STAGES.length - 1} className="text-slate-300 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-16 px-4">
          <AnimatePresence mode="wait">
            <motion.div key={`${currentStage.id}-${showSummary}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              {renderStage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}