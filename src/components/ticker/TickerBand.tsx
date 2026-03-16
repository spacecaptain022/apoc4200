"use client";

import { useRef, useState, ReactNode } from "react";

type TickerBandProps = {
  children: ReactNode;
  speed?: number; // seconds for one full pass
  direction?: "left" | "right";
  label?: string;
  labelColor?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
};

export function TickerBand({
  children,
  speed = 30,
  direction = "left",
  label,
  labelColor = "var(--text-muted)",
  borderTop = false,
  borderBottom = true,
}: TickerBandProps) {
  const [paused, setPaused] = useState(false);
  const animName = direction === "left" ? "ticker-scroll-left" : "ticker-scroll-right";

  return (
    <div
      className="relative flex h-8 w-full items-center overflow-hidden"
      style={{
        borderTop: borderTop ? `1px solid var(--border-subtle)` : undefined,
        borderBottom: borderBottom ? `1px solid var(--border-subtle)` : undefined,
        backgroundColor: "var(--bg-elevated)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Pinned label */}
      {label && (
        <div
          className="z-10 flex h-full shrink-0 items-center border-r px-3 font-data text-[9px] uppercase tracking-[0.14em]"
          style={{
            borderColor: "var(--border-default)",
            backgroundColor: "var(--bg-panel)",
            color: labelColor,
            minWidth: 80,
          }}
        >
          {label}
        </div>
      )}

      {/* Scrolling content — doubled for seamless loop */}
      <div
        style={{
          display: "flex",
          animationName: animName,
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
        }}
      >
        <span className="flex items-center">{children}</span>
        <span className="flex items-center">{children}</span>
      </div>
    </div>
  );
}
