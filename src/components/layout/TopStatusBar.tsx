"use client";

import { SignalDot } from "@/components/ui/SignalDot";
import { Timestamp } from "@/components/ui/Timestamp";

const ROTATING_MESSAGES = [
  "SIGNAL ACQUIRED",
  "MARKET PSYOPS ONLINE",
  "PANIC INDEX ELEVATED",
  "ENEMY NARRATIVE DETECTED",
  "FEED STABLE",
  "TRANSMISSION ACTIVE",
];

export function TopStatusBar() {
  return (
    <div
      className="w-full border-b font-data text-[10px] uppercase"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-elevated)",
        height: 28,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
        {/* Left: live indicator */}
        <div className="flex items-center gap-2">
          <SignalDot color="red" size="sm" pulse />
          <span className="text-[var(--signal-red)] tracking-[0.12em]">LIVE</span>
        </div>

        {/* Center: rotating message */}
        <div className="hidden text-[var(--text-muted)] tracking-[0.1em] sm:block">
          {ROTATING_MESSAGES[0]}
        </div>

        {/* Right: market state + timestamp */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] sm:gap-3">
          <span className="hidden text-[var(--signal-amber)] sm:inline">MARKETS OPEN</span>
          <span className="hidden text-[var(--border-strong)] sm:inline">|</span>
          <Timestamp showDate={false} />
        </div>
      </div>
    </div>
  );
}
