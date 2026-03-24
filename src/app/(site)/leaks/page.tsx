"use client";

import { useState, useEffect, useCallback } from "react";
import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { NarrativeTag } from "@/components/story/NarrativeTag";
import { ArticleReactions } from "@/components/ui/ArticleReactions";
import type { LeakEntry } from "@/lib/leaks-store";

const URGENCY_COLOR: Record<string, string> = {
  BREAKING:   "var(--signal-red)",
  DEVELOPING: "var(--signal-amber)",
  ANALYSIS:   "var(--signal-cyan)",
};

const SOURCE_LABEL: Record<string, string> = {
  INSIDER:            "INSIDER",
  WHISTLEBLOWER:      "WHISTLEBLOWER",
  MARKET_OBSERVATION: "MARKET OBS.",
  TECHNICAL:          "TECHNICAL",
  ANONYMOUS:          "ANONYMOUS",
};

const CATEGORY_FILTER = ["ALL", "CRYPTO", "MARKETS", "GEOPOLITICS", "MACRO", "OTHER"] as const;
type Filter = typeof CATEGORY_FILTER[number];

function timeAgo(ms: number): string {
  const age = Date.now() - ms;
  const mins = Math.floor(age / 60_000);
  const hours = Math.floor(mins / 60);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

function RedactedText({ text }: { text: string }) {
  // Lightly redact parts of the text for atmosphere
  const visible = text.slice(0, 220);
  const redacted = text.length > 220;
  return (
    <p
      className="font-data text-[11px] leading-relaxed"
      style={{ color: "var(--text-secondary)" }}
    >
      {visible}
      {redacted && (
        <span
          className="ml-1 inline-block select-none px-1 align-middle font-data text-[10px] tracking-[0.1em]"
          style={{
            backgroundColor: "var(--text-muted)",
            color:           "var(--text-muted)",
            userSelect:      "none",
          }}
          title="Full transmission classified"
        >
          {"█".repeat(18)}
        </span>
      )}
    </p>
  );
}

function LeakCard({ leak }: { leak: LeakEntry }) {
  const urgencyColor = URGENCY_COLOR[leak.urgency] ?? "var(--text-muted)";

  return (
    <div
      className="group relative flex flex-col gap-3 p-4 transition-all duration-200"
      style={{
        border:          `1px solid var(--border-default)`,
        borderLeft:      `2px solid ${urgencyColor}`,
        backgroundColor: "var(--bg-panel)",
      }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 30px ${urgencyColor}0d` }}
      />

      {/* Header row */}
      <div className="relative flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Urgency badge */}
          <span
            className="flex items-center gap-1.5 font-data text-[9px] uppercase tracking-[0.14em] px-2 py-0.5"
            style={{
              color:           urgencyColor,
              backgroundColor: `color-mix(in srgb, ${urgencyColor} 10%, transparent)`,
              border:          `1px solid ${urgencyColor}60`,
            }}
          >
            {leak.urgency === "BREAKING" && (
              <span className="blink h-1.5 w-1.5 rounded-full" style={{ backgroundColor: urgencyColor }} />
            )}
            {leak.urgency}
          </span>

          {/* Category */}
          <NarrativeTag label={leak.category as never} urgency="default" />

          {/* Source type */}
          <span
            className="font-data text-[9px] uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            SRC: {SOURCE_LABEL[leak.sourceType]}
          </span>
        </div>

        {/* Right: ref + time */}
        <div className="flex items-center gap-3">
          {leak.hasEvidence && (
            <span
              className="font-data text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5"
              style={{
                color:           "var(--signal-amber)",
                border:          "1px solid var(--signal-amber)40",
                backgroundColor: "rgba(255,176,0,0.06)",
              }}
            >
              ⬡ EVIDENCE
            </span>
          )}
          <span
            className="font-data text-[9px] uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            {leak.refId}
          </span>
          <span
            className="font-data text-[9px]"
            style={{ color: "var(--text-muted)" }}
          >
            {timeAgo(leak.receivedAt)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

      {/* Message preview */}
      <div className="relative">
        {/* Scanline texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        <RedactedText text={leak.preview} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <ArticleReactions articleId={leak.id} />
        <span
          className="font-data text-[9px] uppercase tracking-[0.08em]"
          style={{ color: "var(--text-muted)", opacity: 0.5 }}
        >
          TRANSMISSION RECEIVED
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32">
      <div
        className="flex h-20 w-20 items-center justify-center"
        style={{ border: "1px solid var(--border-default)" }}
      >
        <span
          className="font-broadcast text-3xl tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          —
        </span>
      </div>
      <div className="text-center">
        <p
          className="font-broadcast text-xl tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          NO LEAKS LOGGED
        </p>
        <p
          className="mt-2 font-data text-[11px] tracking-[0.08em]"
          style={{ color: "var(--text-muted)", opacity: 0.6 }}
        >
          BE THE FIRST TO TRANSMIT
        </p>
      </div>
      <a
        href="/submit"
        className="font-data text-[11px] uppercase tracking-[0.12em] border px-4 py-2 transition-colors duration-150"
        style={{
          borderColor:     "var(--signal-amber)",
          color:           "var(--signal-amber)",
          backgroundColor: "rgba(255,176,0,0.06)",
        }}
      >
        SUBMIT A LEAK →
      </a>
    </div>
  );
}

export default function LeaksPage() {
  const [leaks, setLeaks]         = useState<LeakEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<Filter>("ALL");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/leaks");
      if (!res.ok) return;
      const data = await res.json();
      setLeaks(data.leaks ?? []);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = filter === "ALL"
    ? leaks
    : leaks.filter((l) => l.category === filter);

  const breakingCount   = leaks.filter((l) => l.urgency === "BREAKING").length;
  const developingCount = leaks.filter((l) => l.urgency === "DEVELOPING").length;

  return (
    <BroadcastShell>
      <div className="mx-auto max-w-[1440px] px-4 py-10">

        {/* Header */}
        <div
          className="mb-8 border-b pb-6"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className="blink inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--signal-red)" }}
                />
                <span
                  className="font-data text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--signal-red)" }}
                >
                  CLASSIFIED FEED
                </span>
              </div>
              <h1
                className="font-broadcast text-4xl tracking-[0.08em]"
                style={{ color: "var(--text-primary)" }}
              >
                LEAK ARCHIVE
              </h1>
              <p
                className="mt-1 font-data text-[11px] tracking-[0.06em]"
                style={{ color: "var(--text-muted)" }}
              >
                ANONYMOUS TRANSMISSIONS · UNVERIFIED · HANDLE WITH CAUTION
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {breakingCount > 0 && (
                <div className="flex flex-col items-end">
                  <span
                    className="font-broadcast text-2xl tabular-nums"
                    style={{ color: "var(--signal-red)" }}
                  >
                    {breakingCount}
                  </span>
                  <span
                    className="font-data text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    BREAKING
                  </span>
                </div>
              )}
              {developingCount > 0 && (
                <div className="flex flex-col items-end">
                  <span
                    className="font-broadcast text-2xl tabular-nums"
                    style={{ color: "var(--signal-amber)" }}
                  >
                    {developingCount}
                  </span>
                  <span
                    className="font-data text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    DEVELOPING
                  </span>
                </div>
              )}
              <div className="flex flex-col items-end">
                <span
                  className="font-broadcast text-2xl tabular-nums"
                  style={{ color: "var(--text-primary)" }}
                >
                  {leaks.length}
                </span>
                <span
                  className="font-data text-[9px] uppercase tracking-[0.1em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  TOTAL
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORY_FILTER.map((cat) => {
              const active = filter === cat;
              const count  = cat === "ALL" ? leaks.length : leaks.filter((l) => l.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="font-data text-[10px] uppercase tracking-[0.1em] border px-3 py-1.5 transition-all duration-150"
                  style={{
                    borderColor:     active ? "var(--signal-red)" : "var(--border-default)",
                    color:           active ? "var(--signal-red)" : "var(--text-muted)",
                    backgroundColor: active ? "rgba(255,43,43,0.07)" : "transparent",
                  }}
                >
                  {cat}
                  {count > 0 && (
                    <span
                      className="ml-1.5 opacity-60"
                      style={{ color: active ? "var(--signal-red)" : "var(--text-muted)" }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit CTA banner */}
        <div
          className="mb-6 flex items-center justify-between gap-4 border px-4 py-3"
          style={{
            borderColor:     "var(--border-subtle)",
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="blink inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--signal-amber)" }}
            />
            <span
              className="font-data text-[10px] uppercase tracking-[0.1em]"
              style={{ color: "var(--text-secondary)" }}
            >
              GOT INTELLIGENCE? THIS BOARD IS LIVE — ALL TRANSMISSIONS ARE ANONYMOUS.
            </span>
          </div>
          <a
            href="/submit"
            className="shrink-0 font-data text-[10px] uppercase tracking-[0.12em] border px-3 py-1.5 transition-colors duration-150"
            style={{
              borderColor:     "var(--signal-amber)",
              color:           "var(--signal-amber)",
              backgroundColor: "rgba(255,176,0,0.06)",
            }}
          >
            TRANSMIT →
          </a>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span
              className="font-broadcast text-xl tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              DECRYPTING ARCHIVE...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((leak) => (
              <LeakCard key={leak.id} leak={leak} />
            ))}
          </div>
        )}

      </div>
    </BroadcastShell>
  );
}
