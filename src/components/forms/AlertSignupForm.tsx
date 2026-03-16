"use client";

import { useState } from "react";
import { Radio } from "lucide-react";
import { SignalDot } from "@/components/ui/SignalDot";

export function AlertSignupForm() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // TODO: wire to /api/alerts + Resend in Phase 4
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  };

  return (
    <div
      className="w-full border p-4 sm:p-5"
      style={{
        borderColor:     "var(--signal-red)",
        backgroundColor: "rgba(255,43,43,0.04)",
        borderRadius:    "var(--radius-md)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <SignalDot color="red" pulse />
        <span
          className="font-broadcast text-base tracking-[0.1em] sm:text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          JOIN THE ALERT FEED
        </span>
      </div>

      <p
        className="mb-4 font-data text-xs leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Market panic alerts. Breaking signal drops. First to know — every time.
      </p>

      {status === "success" ? (
        <div
          className="flex items-center gap-2 border px-3 py-2.5 font-data text-[11px] tracking-[0.1em]"
          style={{
            borderColor:     "var(--signal-green)",
            color:           "var(--signal-green)",
            backgroundColor: "rgba(92,255,92,0.06)",
          }}
        >
          <SignalDot color="green" size="sm" pulse={false} />
          SIGNAL RECEIVED — TRANSMISSION INCOMING
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL"
            required
            className="w-full flex-1 border bg-transparent px-3 py-2.5 font-data text-[11px] uppercase tracking-[0.08em] placeholder:text-[var(--text-muted)] focus:outline-none"
            style={{
              borderColor:  "var(--border-default)",
              color:        "var(--text-primary)",
              borderRadius: "var(--radius-sm)",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-1.5 border px-4 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] transition-all duration-150 disabled:opacity-50 sm:w-auto"
            style={{
              borderColor:     "var(--signal-red)",
              color:           "var(--signal-red)",
              backgroundColor: "rgba(255,43,43,0.08)",
              borderRadius:    "var(--radius-sm)",
            }}
          >
            <Radio size={11} />
            {status === "loading" ? "SENDING" : "SUBSCRIBE"}
          </button>
        </form>
      )}
    </div>
  );
}
