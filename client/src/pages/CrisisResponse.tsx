import { useToast } from "@/hooks/use-toast";
import PageLayout from '@/components/layout/PageLayout';
import CrisisResponseDashboard from "@/components/CrisisResponseDashboard";
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Activity, Clock } from "lucide-react";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";
const OFF = "#F8F7F4";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

export default function CrisisResponse() {
  const { toast } = useToast();
  
  // Fetch organizations to get the correct organization ID
  const { data: organizationsData } = useQuery<any[]>({ queryKey: ['/api/organizations'] });
  const organizations = organizationsData ?? [];
  const organizationId = organizations[0]?.id || '95b97862-8e9d-4c4c-8609-7d8f37b68d36'; // fallback to known UUID

  // Full access to crisis response platform

  return (
    <PageLayout>
      <div className="flex-1 bg-white overflow-auto" data-testid="crisis-response-page">
        {/* Navy Hero Section */}
        <div style={{ background: NAVY, padding: "64px 48px", position: "relative", overflow: "hidden", minHeight: 320 }}>
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", 
            backgroundSize: "44px 44px" 
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>Immediate Response Protocols</span>
                </div>
                <h1 style={{ ...CG, fontWeight: 600, fontSize: "clamp(40px,5vw,56px)", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
                  Crisis Response <em style={{ fontStyle: "italic", color: "#DFC178" }}>Center</em>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl">Emergency management systems and rapid activation protocols for enterprise-scale incidents.</p>
              </div>
              <div className="text-right hidden md:block">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <div className="w-2 h-2 bg-[#3BAF8A] animate-pulse"></div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#3BAF8A" }}>System Operational</span>
                </div>
                <div className="text-white/40 text-xs tracking-widest uppercase">24/7 Monitoring Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", background: OFF, borderBottom:"1px solid #E8E4DC" }}>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>98%</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Crisis Prepared</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>&lt;1h</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Avg Activation</div>
          </div>
          <div style={{ padding:24, borderRight:"1px solid #E8E4DC" }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>15+</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Response Templates</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ ...CG, fontSize: 40, fontWeight: 600, color: GOLD, lineHeight: 1 }}>24/7</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginTop: 4 }}>Surveillance</div>
          </div>
        </div>

        <div className="p-12 max-w-7xl mx-auto">
          {/* Crisis Response Dashboard */}
          <CrisisResponseDashboard organizationId={organizationId} />
        </div>
      </div>
    </PageLayout>
  );
}