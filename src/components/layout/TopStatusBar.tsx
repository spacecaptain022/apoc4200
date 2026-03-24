"use client";

import { useState, useEffect } from "react";
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

function getMarketStatus(): { label: string; open: boolean } {
  // NYSE/NASDAQ: Mon–Fri 9:30–16:00 ET
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay(); // 0=Sun, 6=Sat
  const hours = et.getHours();
  const mins = et.getMinutes();
  const totalMins = hours * 60 + mins;

  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = totalMins >= 9 * 60 + 30 && totalMins < 16 * 60;
  const isPreMarket = isWeekday && totalMins >= 4 * 60 && totalMins < 9 * 60 + 30;
  const isAfterHours = isWeekday && totalMins >= 16 * 60 && totalMins < 20 * 60;

  if (isWeekday && isMarketHours) return { label: "MARKETS OPEN", open: true };
  if (isPreMarket) return { label: "PRE-MARKET", open: false };
  if (isAfterHours) return { label: "AFTER-HOURS", open: false };
  return { label: "MARKETS CLOSED", open: false };
}

export function TopStatusBar() {
  const [market, setMarket] = useState<{ label: string; open: boolean }>({ label: "MARKETS CLOSED", open: false });

  useEffect(() => {
    setMarket(getMarketStatus());
    const id = setInterval(() => setMarket(getMarketStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

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
          <span
            className="hidden sm:inline"
            style={{ color: market.open ? "var(--signal-amber)" : "var(--text-muted)" }}
          >
            {market.label}
          </span>
          <span className="hidden text-[var(--border-strong)] sm:inline">|</span>
          <Timestamp showDate={false} />
        </div>
      </div>
    </div>
  );
}
