import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { VaughnMartinLogo } from "@/components/VaughnMartinLogo";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAVY = "#0A0F2E";
const GOLD = "#C9A84C";
const TEAL = "#2B8A6E";

type State = "validating" | "ready" | "entering" | "success" | "expired" | "used" | "invalid" | "error";

export default function MagicLogin() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<State>("validating");
  const [firstName, setFirstName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (!t) {
      setState("invalid");
      return;
    }

    setToken(t);

    // First check if the user is already authenticated — if so, skip the token
    // flow entirely and send them straight to Mission Control.
    fetch("/api/auth/user", { credentials: "include" })
      .then(async (authRes) => {
        if (authRes.ok) {
          // Already logged in — bypass the token flow, go directly to platform.
          setState("success");
          window.location.href = "/mission-control";
          return;
        }

        // Not authenticated — validate the token (read-only, does NOT consume it).
        // Email security scanners hit GET links; the separate validate endpoint
        // keeps the token alive until the user explicitly clicks "Enter Platform".
        fetch(`/api/auth/magic-link/validate?token=${encodeURIComponent(t)}`, {
          method: "GET",
          credentials: "include",
        })
          .then(async (res) => {
            const body = await res.json().catch(() => ({}));
            if (res.ok) {
              setFirstName(body.firstName || "");
              setState("ready");
            } else {
              const reason = body.reason as string | undefined;
              if (reason === "expired") setState("expired");
              else if (reason === "already_used") setState("used");
              else setState("invalid");
            }
          })
          .catch(() => setState("error"));
      })
      .catch(() => setState("error"));
  }, []);

  function handleEnter() {
    if (!token) return;
    setState("entering");

    // POST to verify — consumes the token and creates the session.
    // Email scanners do not send POST requests, so this is the safe consume step.
    fetch("/api/auth/magic-link/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setState("success");
          // Full page reload guarantees the new session cookie is picked up
          // before the protected route checks authentication — no race condition.
          window.location.href = "/mission-control";
        } else {
          const body = await res.json().catch(() => ({}));
          const reason = body.reason as string | undefined;
          if (reason === "expired") setState("expired");
          else if (reason === "already_used") setState("used");
          else setState("invalid");
        }
      })
      .catch(() => setState("error"));
  }

  type StateConfig = {
    icon: JSX.Element;
    title: string;
    message: string;
    action?: JSX.Element;
    cta?: { label: string; href: string };
  };

  const states: Record<State, StateConfig> = {
    validating: {
      icon: <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />,
      title: "Verifying your link…",
      message: "Hang tight — confirming your access.",
    },
    ready: {
      icon: <CheckCircle className="h-10 w-10" style={{ color: TEAL }} />,
      title: firstName ? `Welcome, ${firstName}.` : "Your access is ready.",
      message: "Your Readiness OS access has been confirmed. Click below to enter the platform.",
      action: (
        <Button
          onClick={handleEnter}
          className="w-full h-12 font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: GOLD, color: NAVY }}
        >
          Enter the Platform <ArrowRight size={16} />
        </Button>
      ),
    },
    entering: {
      icon: <Loader2 className="h-10 w-10 animate-spin" style={{ color: GOLD }} />,
      title: "Activating your session…",
      message: "Setting up your executive view — just a moment.",
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
      message: "Each link is single-use for security. If you need to access the platform again, request a new link — it takes 30 seconds.",
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
        <VaughnMartinLogo color="light" height={40} variant="full" />
      </div>

      <div
        className="w-full max-w-md p-10 text-center"
        style={{ background: "#ffffff" }}
      >
        <div className="flex justify-center mb-6">{current.icon}</div>

        <h1 className="text-xl font-bold mb-3" style={{ color: NAVY }}>
          {current.title}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B7280" }}>
          {current.message}
        </p>

        {current.action}

        {current.cta && (
          <Button
            onClick={() => setLocation(current.cta!.href)}
            className="w-full h-11 font-bold text-sm"
            style={{ background: GOLD, color: NAVY }}
          >
            {current.cta.label}
          </Button>
        )}

        {(state === "validating" || state === "entering") && (
          <div className="mt-6 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 animate-bounce"
                style={{ background: GOLD, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.68)" }}>
        Need help?{" "}
        <a href="mailto:pilot@vaughnmartin.com" style={{ color: "rgba(255,255,255,0.5)" }}>
          pilot@vaughnmartin.com
        </a>
      </p>
    </div>
  );
}
