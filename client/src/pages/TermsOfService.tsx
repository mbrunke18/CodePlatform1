import PageLayout from "@/components/layout/PageLayout";
import { Link } from "wouter";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const MUTED = "#6B7280";
const BORDER = "#E8E4DC";
const OFF = "#F8F7F4";

const EFFECTIVE_DATE = "April 1, 2026";
const COMPANY = "VaughnMartin, LLC";
const CONTACT_EMAIL = "legal@vaughnmartin.com";
const SITE = "vaughnmartin.com";

export default function TermsOfService() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      body: `By accessing or using the Readiness OS platform, website, or any associated services operated by ${COMPANY} ("VaughnMartin," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the platform.`,
    },
    {
      id: "ip",
      title: "2. Intellectual Property",
      body: `All content on this platform — including but not limited to the IDEA Framework™, the 180 strategic Readiness Protocols, trigger patterns, signal scoring methodology, written copy, visual design, software architecture, and the VaughnMartin and Readiness OS trademarks — is the exclusive intellectual property of ${COMPANY} and is protected by United States and international copyright, trademark, and trade secret law.\n\nThe IDEA Framework™ (IDENTIFY, DETECT, EXECUTE, ADVANCE), the "3,600× Execution Head Start" methodology, and the Readiness Protocol content represent proprietary operational knowledge developed over years of enterprise experience. These materials may not be reproduced, distributed, modified, reverse-engineered, or used to create derivative works without express written permission from VaughnMartin.`,
    },
    {
      id: "prohibited",
      title: "3. Prohibited Uses",
      body: `You agree that you will NOT:\n\n(a) Use any automated tool, bot, crawler, scraper, spider, agent, or AI system to access, copy, index, or reconstruct any portion of the platform, its content, its API responses, or its underlying methodology;\n\n(b) Use the platform's public demo, marketing materials, or API endpoints to reconstruct, replicate, or train any system intended to compete with or approximate VaughnMartin's products or services;\n\n(c) Access or attempt to access any API endpoint, Readiness Protocol content, or platform feature in a manner that exceeds authorized access or circumvents access controls;\n\n(d) Copy, reproduce, republish, or redistribute the Readiness Protocol library, trigger patterns, signal scoring logic, or IDEA Framework methodology in any form;\n\n(e) Use VaughnMartin, Readiness OS, or IDEA Framework as a trademark, service mark, trade name, or product name without express written authorization;\n\n(f) Represent any product or service as affiliated with, endorsed by, or derived from VaughnMartin or Readiness OS without authorization.`,
    },
    {
      id: "api",
      title: "4. API Access and Rate Limits",
      body: `Access to the VaughnMartin API is subject to rate limits. Systematic or automated access to public API endpoints beyond normal usage patterns is prohibited. We reserve the right to block or throttle any IP address, user agent, or access pattern that appears to be automated, bulk, or intended for competitive intelligence gathering.`,
    },
    {
      id: "confidentiality",
      title: "5. Confidentiality of Partner Materials",
      body: `Founding Partners and users granted access to the authenticated platform agree that all materials accessed within the platform — including unreleased Readiness Protocols, configuration templates, execution data, and platform features — are confidential and may not be shared, published, or disclosed to third parties without VaughnMartin's prior written consent.`,
    },
    {
      id: "enforcement",
      title: "6. Enforcement and Remedies",
      body: `VaughnMartin reserves the right to pursue all available legal remedies against any party that violates these Terms, including but not limited to injunctive relief, monetary damages, and attorneys' fees. Violations of Section 3 (Prohibited Uses) may constitute copyright infringement, trade secret misappropriation, or unfair competition under applicable law.\n\nWe monitor platform access patterns and reserve the right to terminate access, block requests, and take legal action without prior notice when violations are detected.`,
    },
    {
      id: "disclaimer",
      title: "7. Disclaimer of Warranties",
      body: `The platform is provided "as is" and "as available" without warranty of any kind, express or implied. VaughnMartin does not warrant that the platform will be error-free, uninterrupted, or free of security vulnerabilities.`,
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      body: `To the maximum extent permitted by law, VaughnMartin shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, even if VaughnMartin has been advised of the possibility of such damages.`,
    },
    {
      id: "governing",
      title: "9. Governing Law",
      body: `These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved exclusively in the state or federal courts located in Delaware.`,
    },
    {
      id: "changes",
      title: "10. Changes to These Terms",
      body: `VaughnMartin reserves the right to modify these Terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated Terms. We will post the effective date of the most recent revision at the top of this page.`,
    },
    {
      id: "contact",
      title: "11. Contact",
      body: `For questions about these Terms, intellectual property inquiries, or to report a suspected violation, contact us at:\n\n${COMPANY}\n${CONTACT_EMAIL}\n${SITE}`,
    },
  ];

  return (
    <PageLayout>
      <div style={{ background: OFF, minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ background: NAVY, padding: "72px 48px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)",
            backgroundSize: "44px 44px"
          }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-0.5" style={{ background: GOLD }} />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Legal
              </span>
            </div>
            <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 700, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>
              Terms of Service
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500 }}>
              Effective Date: {EFFECTIVE_DATE} · {COMPANY}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Intro */}
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: "20px 24px", marginBottom: 40 }}>
            <p style={{ fontSize: 13, color: NAVY, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
              VaughnMartin's Readiness OS platform, Readiness Protocol library, IDEA Framework™, and all associated methodologies represent proprietary intellectual property. These Terms exist to protect that work and to make clear what is and is not permitted. Please read them carefully before using this platform.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} id={section.id}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>
                  {section.title}
                </h2>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {section.body}
                </div>
              </div>
            ))}
          </div>

          {/* Footer nav */}
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 32, flexWrap: "wrap" }}>
            <Link href="/contact">
              <span style={{ fontSize: 13, color: GOLD, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Contact Us</span>
            </Link>
            <Link href="/founding-partner-program">
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500, cursor: "pointer" }}>Apply for Founding Partner Access</span>
            </Link>
            <Link href="/">
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500, cursor: "pointer" }}>Return Home</span>
            </Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: MUTED }}>
            © {new Date().getFullYear()} {COMPANY}. All rights reserved. VaughnMartin, Readiness OS, and IDEA Framework are trademarks of {COMPANY}.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
