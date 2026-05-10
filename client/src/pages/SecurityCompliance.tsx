import { useEffect } from "react";
import { Shield, Lock, Server, Eye, FileCheck, Users, CheckCircle, AlertCircle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from "@/lib/seo";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

const sections = [
  {
    icon: Lock,
    title: "Authentication & Access Control",
    items: [
      { label: "SSO / OIDC Authentication", detail: "Replit OIDC with OpenID Connect — enterprise SSO-ready" },
      { label: "Role-Based Access Control", detail: "Granular RBAC with admin, executive, and operator tiers" },
      { label: "Session Management", detail: "Postgres-backed sessions with configurable TTL (7-day default)" },
      { label: "Email Allowlist Gate", detail: "Platform admin controls authorized access list; unauthorized logins blocked" },
      { label: "Fail-Closed Authorization", detail: "All role and permission errors default to deny — no permissive fallbacks" },
      { label: "Org Tenant Isolation", detail: "Every data write validates org membership before executing" },
    ],
  },
  {
    icon: Server,
    title: "Infrastructure & Data",
    items: [
      { label: "Database", detail: "Neon PostgreSQL — serverless, encrypted at rest, SOC 2 Type II certified" },
      { label: "Data Isolation", detail: "Organization-scoped queries on all user data — cross-tenant reads prevented" },
      { label: "Transport Security", detail: "TLS 1.2+ enforced on all API and WebSocket connections" },
      { label: "Environment Secrets", detail: "API keys and credentials stored as encrypted secrets — never in code" },
      { label: "Rate Limiting", detail: "Express rate limiting on all API endpoints to prevent abuse" },
      { label: "Security Headers", detail: "Helmet.js — X-Frame-Options, CSP, HSTS, and XSS protection" },
    ],
  },
  {
    icon: Eye,
    title: "Monitoring & Audit",
    items: [
      { label: "Request Audit Log", detail: "Every API request logged with method, path, user ID, and response time" },
      { label: "Error Tracking", detail: "Structured error logging via Pino — all exceptions captured with context" },
      { label: "Background Job Queue", detail: "PostgreSQL-backed job queue with full job history and retry tracking" },
      { label: "Health Monitoring", detail: "Live health endpoints for uptime monitoring and deployment validation" },
      { label: "Signal Activity Log", detail: "Full audit trail of all detected signals, trigger evaluations, and alert creations" },
      { label: "Activation History", detail: "Every protocol activation logged with timestamp, user, org, and outcome" },
    ],
  },
  {
    icon: Users,
    title: "Data Governance",
    items: [
      { label: "Data Ownership", detail: "Customer data is exclusively owned by the customer organization" },
      { label: "Data Residency", detail: "US-hosted infrastructure — Neon Postgres (AWS us-east-1)" },
      { label: "Data Retention", detail: "Configurable per organization — no indefinite retention of sensitive data" },
      { label: "User Deletion", detail: "Full account and organization deletion available via admin panel" },
      { label: "No Data Commingling", detail: "Demo, pilot, and production data paths are separated at the service layer" },
      { label: "Vendor Data Access", detail: "VaughnMartin staff cannot access customer org data without explicit consent" },
    ],
  },
  {
    icon: FileCheck,
    title: "Compliance Readiness",
    items: [
      { label: "SOC 2 Type II", detail: "Database infrastructure (Neon) is SOC 2 Type II certified — platform SOC 2 audit in roadmap" },
      { label: "GDPR Alignment", detail: "Data deletion, retention controls, and consent-based access model in place" },
      { label: "Enterprise Procurement", detail: "Security questionnaire support available for Founding Partners" },
      { label: "Penetration Testing", detail: "External security assessment planned prior to general availability" },
      { label: "Incident Response", detail: "Documented incident response procedure with named executive DRI" },
      { label: "Vulnerability Disclosure", detail: "Responsible disclosure program — contact security@vaughnmartin.com" },
    ],
  },
  {
    icon: Shield,
    title: "AI & Automation Safety",
    items: [
      { label: "Human Authorization Required", detail: "No Readiness Protocol activates without explicit executive sign-off" },
      { label: "AI Isolation", detail: "AI analysis runs in sandboxed job queue — cannot directly modify org data" },
      { label: "Prompt Injection Controls", detail: "User inputs sanitized before passing to AI analysis pipeline" },
      { label: "Model Provider", detail: "Azure OpenAI (primary) with OpenAI fallback — enterprise data processing agreements" },
      { label: "Output Validation", detail: "Model output validated against schema before persisting to database" },
      { label: "Audit Trail", detail: "All AI-assisted recommendations logged with model, timestamp, and confidence score" },
    ],
  },
];

const highlights = [
  { icon: CheckCircle, color: TEAL, label: "Fail-closed auth on all mutable routes" },
  { icon: CheckCircle, color: TEAL, label: "TLS encrypted in transit & at rest" },
  { icon: CheckCircle, color: TEAL, label: "Org-scoped tenant isolation" },
  { icon: CheckCircle, color: TEAL, label: "No activation without executive sign-off" },
  { icon: CheckCircle, color: TEAL, label: "Full request audit logging" },
  { icon: CheckCircle, color: TEAL, label: "SOC 2 certified database infrastructure" },
];

export default function SecurityCompliance() {
  useEffect(() => {
    updatePageMetadata({
      title: "Security & Compliance — VaughnMartin Readiness OS",
      description: "Enterprise security overview for VaughnMartin Readiness OS. Authentication, data governance, compliance readiness, and AI safety controls for Fortune 1000 procurement teams.",
      ogTitle: "Security & Compliance — VaughnMartin Readiness OS",
      ogDescription: "Enterprise-grade security controls, tenant isolation, and compliance readiness for Fortune 1000 procurement.",
    });
  }, []);

  return (
    <PageLayout>
      <div style={{ background: "#F8F7F4", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: NAVY, padding: "4rem 2rem 3rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <Shield size={20} color={GOLD} />
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", color: GOLD, textTransform: "uppercase" }}>
                Security & Compliance
              </span>
            </div>
            <h1 style={{ margin: "0 0 1rem", fontSize: "2.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Enterprise-Grade Security<br />Built for Fortune 1000 Procurement
            </h1>
            <p style={{ margin: "0 0 2rem", fontSize: "1rem", color: "#9CA3AF", lineHeight: 1.7, maxWidth: 620 }}>
              VaughnMartin Readiness OS is architected for organizations where security, data sovereignty,
              and auditability are non-negotiable. This page is designed to support your procurement and
              security review process.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {highlights.map(h => (
                <div key={h.label} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  padding: "0.5rem 1rem", borderRadius: 3,
                }}>
                  <h.icon size={14} color={h.color} />
                  <span style={{ fontSize: "0.8125rem", color: "#E5E7EB", fontWeight: 500 }}>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div style={{ height: 3, background: GOLD }} />

        {/* Sections */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 2rem" }}>
          <div style={{ display: "grid", gap: "2rem" }}>
            {sections.map(section => (
              <div key={section.title} style={{
                background: "#fff", border: "1px solid #E8E4DC",
                borderRadius: 4, overflow: "hidden",
              }}>
                <div style={{
                  padding: "1rem 1.5rem", borderBottom: "1px solid #E8E4DC",
                  background: "#FAFAF8", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <section.icon size={16} color={NAVY} />
                  <h2 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: NAVY }}>
                    {section.title}
                  </h2>
                </div>
                <div style={{ padding: "0.5rem 0" }}>
                  {section.items.map((item, i) => (
                    <div key={item.label} style={{
                      display: "grid", gridTemplateColumns: "220px 1fr",
                      padding: "0.75rem 1.5rem",
                      borderBottom: i < section.items.length - 1 ? "1px solid #F3F4F6" : "none",
                      gap: "1rem", alignItems: "start",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: NAVY }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6 }}>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Roadmap notice */}
          <div style={{
            marginTop: "2rem", background: "#FBF8F0",
            border: "1px solid #E8D89A", borderLeft: `3px solid ${GOLD}`,
            borderRadius: 4, padding: "1.25rem 1.5rem",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <AlertCircle size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: NAVY }}>
                SOC 2 Type II Audit — In Roadmap
              </p>
              <p style={{ margin: "0.375rem 0 0", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6 }}>
                Platform-level SOC 2 Type II certification is on the roadmap for General Availability.
                Founding Partners receive full security questionnaire support and a dedicated pre-certification
                architecture review. Database infrastructure (Neon PostgreSQL) is already SOC 2 Type II certified.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div style={{
            marginTop: "1.5rem", background: NAVY,
            borderRadius: 4, padding: "2rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "1.5rem",
          }}>
            <div>
              <h3 style={{ margin: "0 0 0.5rem", color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                Security Review Support
              </h3>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: 480 }}>
                Founding Partners receive dedicated security review support including custom questionnaire
                responses, architecture documentation, and a named security contact throughout procurement.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href="/founding-partner-program" style={{
                display: "inline-block", padding: "0.6875rem 1.25rem",
                background: GOLD, color: NAVY, borderRadius: 3,
                fontWeight: 700, fontSize: "0.875rem", textDecoration: "none",
              }}>
                Apply for Founding Partner Access
              </a>
              <a href="/contact" style={{
                display: "inline-block", padding: "0.6875rem 1.25rem",
                background: "transparent", color: "#D1D5DB",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 3,
                fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
              }}>
                Security Questions
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
