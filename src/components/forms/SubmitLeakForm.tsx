"use client";

import { useState } from "react";
import { Send, Shield, Radio, Lock } from "lucide-react";
import { SignalDot } from "@/components/ui/SignalDot";
import type { SubmitLeakPayload } from "@/app/api/submit/route";

type Status = "idle" | "loading" | "success" | "error";

const CATEGORIES: { value: SubmitLeakPayload["category"]; label: string; color: string }[] = [
  { value: "CRYPTO",      label: "CRYPTO",      color: "var(--signal-green)"  },
  { value: "MARKETS",     label: "MARKETS",     color: "var(--signal-cyan)"   },
  { value: "GEOPOLITICS", label: "GEOPOLITICS", color: "var(--signal-amber)"  },
  { value: "MACRO",       label: "MACRO",       color: "var(--signal-red)"    },
  { value: "OTHER",       label: "OTHER",       color: "var(--text-secondary)"},
];

const SOURCE_TYPES: { value: SubmitLeakPayload["sourceType"]; label: string; desc: string }[] = [
  { value: "INSIDER",            label: "INSIDER",            desc: "Direct access to information"      },
  { value: "WHISTLEBLOWER",      label: "WHISTLEBLOWER",      desc: "Exposing wrongdoing or cover-ups"   },
  { value: "MARKET_OBSERVATION", label: "MARKET OBS.",        desc: "Pattern or anomaly detected"        },
  { value: "TECHNICAL",          label: "TECHNICAL",          desc: "On-chain / data analysis"           },
  { value: "ANONYMOUS",          label: "ANONYMOUS",          desc: "Prefer not to say"                  },
];

const URGENCIES: { value: SubmitLeakPayload["urgency"]; label: string; color: string }[] = [
  { value: "BREAKING",   label: "BREAKING NOW",  color: "var(--signal-red)"   },
  { value: "DEVELOPING", label: "DEVELOPING",    color: "var(--signal-amber)" },
  { value: "ANALYSIS",   label: "ANALYSIS",      color: "var(--signal-cyan)"  },
];

export function SubmitLeakForm() {
  const [category,   setCategory]   = useState<SubmitLeakPayload["category"]>("CRYPTO");
  const [sourceType, setSourceType] = useState<SubmitLeakPayload["sourceType"]>("ANONYMOUS");
  const [urgency,    setUrgency]    = useState<SubmitLeakPayload["urgency"]>("DEVELOPING");
  const [message,    setMessage]    = useState("");
  const [contact,    setContact]    = useState("");
  const [status,     setStatus]     = useState<Status>("idle");
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, sourceType, urgency, message, contact: contact || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "TRANSMISSION FAILED — TRY AGAIN");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("TRANSMISSION FAILED — CHECK CONNECTION");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center border"
          style={{ borderColor: "var(--signal-green)", backgroundColor: "rgba(92,255,92,0.06)" }}
        >
          <Shield size={28} style={{ color: "var(--signal-green)" }} />
        </div>
        <div>
          <p
            className="font-broadcast text-2xl tracking-[0.1em]"
            style={{ color: "var(--signal-green)" }}
          >
            SIGNAL RECEIVED
          </p>
          <p
            className="mt-2 font-data text-xs tracking-[0.08em]"
            style={{ color: "var(--text-muted)" }}
          >
            YOUR TRANSMISSION HAS BEEN LOGGED. WE WILL INVESTIGATE.
          </p>
        </div>
        <button
          onClick={() => {
            setStatus("idle");
            setMessage("");
            setContact("");
          }}
          className="font-data text-[10px] uppercase tracking-[0.12em] underline"
          style={{ color: "var(--text-muted)" }}
        >
          SUBMIT ANOTHER LEAK
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Category */}
      <fieldset>
        <legend
          className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          01 — SIGNAL CATEGORY
        </legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className="border px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor:     active ? cat.color : "var(--border-default)",
                  color:           active ? cat.color : "var(--text-muted)",
                  backgroundColor: active ? `color-mix(in srgb, ${cat.color} 10%, transparent)` : "transparent",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Source type */}
      <fieldset>
        <legend
          className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          02 — SOURCE TYPE
        </legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCE_TYPES.map((src) => {
            const active = sourceType === src.value;
            return (
              <button
                key={src.value}
                type="button"
                onClick={() => setSourceType(src.value)}
                className="flex flex-col items-start gap-1 border p-3 text-left transition-all duration-150"
                style={{
                  borderColor:     active ? "var(--signal-amber)" : "var(--border-default)",
                  backgroundColor: active ? "rgba(255,176,0,0.06)" : "var(--bg-panel)",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                <span
                  className="font-data text-[10px] uppercase tracking-[0.1em]"
                  style={{ color: active ? "var(--signal-amber)" : "var(--text-secondary)" }}
                >
                  {src.label}
                </span>
                <span
                  className="font-data text-[9px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {src.desc}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Urgency */}
      <fieldset>
        <legend
          className="mb-3 font-data text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          03 — URGENCY ASSESSMENT
        </legend>
        <div className="flex flex-wrap gap-2">
          {URGENCIES.map((u) => {
            const active = urgency === u.value;
            return (
              <button
                key={u.value}
                type="button"
                onClick={() => setUrgency(u.value)}
                className="flex items-center gap-2 border px-3 py-1.5 font-data text-[10px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor:     active ? u.color : "var(--border-default)",
                  color:           active ? u.color : "var(--text-muted)",
                  backgroundColor: active ? `color-mix(in srgb, ${u.color} 8%, transparent)` : "transparent",
                  borderRadius:    "var(--radius-sm)",
                }}
              >
                {active && (
                  <span
                    className="blink inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: u.color }}
                  />
                )}
                {u.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Message */}
      <div>
        <label
          className="mb-2 block font-data text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          04 — THE LEAK <span style={{ color: "var(--signal-red)" }}>*</span>
        </label>
        <textarea
          required
          minLength={20}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="WHAT DO YOU KNOW? BE SPECIFIC. NAMES, DATES, TICKERS, AMOUNTS. THE MORE DETAIL, THE MORE SIGNAL."
          rows={7}
          className="w-full resize-y border bg-transparent px-4 py-3 font-data text-[11px] leading-relaxed tracking-[0.04em] placeholder:text-[var(--text-muted)] focus:outline-none"
          style={{
            borderColor:  "var(--border-default)",
            color:        "var(--text-primary)",
            borderRadius: "var(--radius-sm)",
            minHeight:    "160px",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--signal-amber)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
        <div className="mt-1 flex justify-between">
          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
            MIN 20 CHARS
          </span>
          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
            {message.length} / 5000
          </span>
        </div>
      </div>

      {/* Contact (optional) */}
      <div>
        <label
          className="mb-2 block font-data text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          05 — CONTACT VECTOR{" "}
          <span className="font-data text-[9px] normal-case tracking-normal" style={{ color: "var(--text-muted)" }}>
            (optional — for follow-up only)
          </span>
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={200}
          placeholder="@TWITTER / SIGNAL / EMAIL — OR LEAVE BLANK TO STAY ANONYMOUS"
          className="w-full border bg-transparent px-4 py-3 font-data text-[11px] uppercase tracking-[0.04em] placeholder:text-[var(--text-muted)] focus:outline-none"
          style={{
            borderColor:  "var(--border-default)",
            color:        "var(--text-primary)",
            borderRadius: "var(--radius-sm)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--signal-amber)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
      </div>

      {/* Error */}
      {status === "error" && error && (
        <div
          className="flex items-center gap-2 border px-3 py-2.5 font-data text-[11px] tracking-[0.08em]"
          style={{
            borderColor:     "var(--signal-red)",
            color:           "var(--signal-red)",
            backgroundColor: "rgba(255,43,43,0.06)",
            borderRadius:    "var(--radius-sm)",
          }}
        >
          <SignalDot color="red" size="sm" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading" || message.length < 20}
        className="flex items-center justify-center gap-2 border px-6 py-4 font-broadcast text-base tracking-[0.14em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor:     "var(--signal-amber)",
          color:           "var(--signal-amber)",
          backgroundColor: "rgba(255,176,0,0.06)",
          borderRadius:    "var(--radius-md)",
        }}
        onMouseEnter={(e) => {
          if (status !== "loading") {
            e.currentTarget.style.backgroundColor = "rgba(255,176,0,0.14)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,176,0,0.06)";
        }}
      >
        {status === "loading" ? (
          <>
            <Radio size={14} className="animate-spin" />
            TRANSMITTING...
          </>
        ) : (
          <>
            <Send size={14} />
            TRANSMIT LEAK
          </>
        )}
      </button>
    </form>
  );
}
