import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

type State = "verifying" | "success" | "expired" | "used" | "invalid" | "error";

export default function MagicLogin() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<State>("verifying");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setState("invalid");
      return;
    }

    fetch(`/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          setState("success");
          setTimeout(() => navigate("/command-center"), 1800);
        } else {
          const body = await res.json().catch(() => ({}));
          const reason = body.reason as string | undefined;
          if (reason === "expired") setState("expired");
          else if (reason === "already_used") setState("used");
          else setState("invalid");
        }
      })
      .catch(() => setState("error"));
  }, [navigate]);

  const states: Record<State, { icon: JSX.Element; title: string; message: string; cta?: { label: string; href: string } }> = {
    verifying: {
      icon: <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />,
      title: "Verifying your access…",
      message: "Hang tight — we're confirming your link and preparing your platform view.",
    },
    success: {
      icon: <CheckCircle className="h-10 w-10" style={{ color: TEAL }} />,
      title: "Access confirmed.",
      message: "Taking you to the Command Center now…",
    },
    expired: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#EF4444" }} />,
      title: "This link has expired.",
      message: "Access links are valid for 24 hours. Request a fresh link below.",
      cta: { label: "Request a New Link", href: "/request-access" },
    },
    used: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#EF4444" }} />,
      title: "This link has already been used.",
      message: "Each link is single-use. If you need access again, request a new link.",
      cta: { label: "Request a New Link", href: "/request-access" },
    },
    invalid: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#EF4444" }} />,
      title: "Invalid access link.",
      message: "We couldn't find this link. It may have been removed or is malformed.",
      cta: { label: "Request Access", href: "/request-access" },
    },
    error: {
      icon: <XCircle className="h-10 w-10" style={{ color: "#EF4444" }} />,
      title: "Something went wrong.",
      message: "We encountered an error verifying your link. Please try again or contact pilot@vaughnmartin.com.",
      cta: { label: "Request a New Link", href: "/request-access" },
    },
  };

  const current = states[state];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: NAVY }}
    >
      <div className="mb-12">
        <VaughnMartinLogo color="white" size={40} variant="full" />
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{ background: "#ffffff" }}
      >
        <div className="flex justify-center mb-6">{current.icon}</div>

        <h1 className="text-xl font-bold mb-3" style={{ color: NAVY }}>
          {current.title}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
          {current.message}
        </p>

        {current.cta && (
          <Button
            onClick={() => navigate(current.cta!.href)}
            className="w-full h-11 font-bold text-sm"
            style={{ background: GOLD, color: NAVY }}
          >
            {current.cta.label}
          </Button>
        )}

        {state === "verifying" && (
          <div className="mt-6 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ background: GOLD, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        Need help?{" "}
        <a href="mailto:pilot@vaughnmartin.com" style={{ color: "rgba(255,255,255,0.5)" }}>
          pilot@vaughnmartin.com
        </a>
      </p>
    </div>
  );
}
