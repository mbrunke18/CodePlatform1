import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExecuteIQLogo } from "@/components/ExecuteIQLogo";
import { apiRequest } from "@/lib/queryClient";
import { Lock, ArrowRight, Shield, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const STORAGE_KEY = "vm_investor_access";
const NAVY = "#0A0F2E";
const NAVY_BG = "#132558";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#DFC178";
const TEAL = "#2B8A6E";
const CG: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };

interface InvestorGateProps {
  children: React.ReactNode;
  pageName?: string;
}

export default function InvestorGate({ children, pageName = "/investor-resources" }: InvestorGateProps) {
  const [granted, setGranted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useLocation();

  const [form, setForm] = useState({ name: "", email: "", company: "", role: "" });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { expires } = JSON.parse(stored);
        if (Date.now() < expires) {
          setGranted(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company || !form.role) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("POST", "/api/investor-access", {
        ...form,
        pageAccessed: location || pageName,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        email: form.email,
      }));
      setGranted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return null;
  if (granted) return <>{children}</>;

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY_BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>

      {/* Escape navigation bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 56, background: "rgba(10,15,46,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <button
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={() => setLocation("/")}
          style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.9, transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.9")}
        >
          <ExecuteIQLogo variant="full" height={28} color="white" />
        </button>

        <button
          onClick={() => setLocation("/")}
          style={{ display: "flex", alignItems: "center", gap: 6, color: GOLD, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", background: "none", border: "1px solid rgba(201,168,76,0.35)", padding: "6px 14px", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
        >
          Return to Platform
        </button>
      </div>

      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(201,168,76,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.09) 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: -120, right: -80, width: 700, height: 700, background: "radial-gradient(ellipse,rgba(43,138,110,0.18) 0%,transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -80, width: 600, height: 600, background: "radial-gradient(ellipse,rgba(201,168,76,0.12) 0%,transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 480 }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <ExecuteIQLogo variant="full" height={80} color="white" />
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", padding: "44px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", padding: "8px 18px", marginBottom: 24 }}>
              <Lock size={11} color={GOLD} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>Investor Access Required</span>
            </div>
            <h1 style={{ ...CG, fontSize: 28, fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
              Investor Materials
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              These materials are shared exclusively with prospective investors and strategic partners. Please introduce yourself to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith"
                style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Work Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@fund.com"
                style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Company / Fund</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="Sequoia Capital"
                style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Role</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: form.role ? "#fff" : "rgba(255,255,255,0.35)", padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", appearance: "none" }}
              >
                <option value="" style={{ background: NAVY }}>Select your role</option>
                <option value="VC / Investor" style={{ background: NAVY }}>VC / Investor</option>
                <option value="Angel Investor" style={{ background: NAVY }}>Angel Investor</option>
                <option value="Family Office" style={{ background: NAVY }}>Family Office</option>
                <option value="Strategic Partner" style={{ background: NAVY }}>Strategic Partner</option>
                <option value="Board Advisor" style={{ background: NAVY }}>Board Advisor</option>
                <option value="Executive / C-Suite" style={{ background: NAVY }}>Executive / C-Suite</option>
                <option value="Other" style={{ background: NAVY }}>Other</option>
              </select>
            </div>

            {error && (
              <p style={{ fontSize: 12, color: "#F87171", textAlign: "center", margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: submitting ? GOLD + "99" : GOLD, color: NAVY, padding: "16px 28px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.25s", marginTop: 4 }}
            >
              {submitting ? "Verifying..." : "Access Investor Materials"}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, justifyContent: "center" }}>
            <Shield size={11} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>Confidential — not for distribution</span>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          Questions? <a href="mailto:info@vaughnmartin.com" style={{ color: GOLD_LIGHT, textDecoration: "none" }}>info@vaughnmartin.com</a>
        </p>
      </div>
    </div>
  );
}
