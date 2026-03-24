"use client";

import { motion } from "motion/react";

type FloatingStatCardProps = {
  label: string;
  value: string;
  change?: number;
  accentColor?: string;
  status?: "live" | "alert" | "sync";
  delay?: number;
  onClick?: () => void;
};

export function FloatingStatCard({
  label,
  value,
  change,
  accentColor = "var(--signal-green)",
  delay = 0,
  onClick,
}: FloatingStatCardProps) {
  const isUp   = change !== undefined && change > 0;
  const isDown = change !== undefined && change < 0;
  const changeColor = isUp
    ? "var(--signal-green)"
    : isDown
    ? "var(--signal-red)"
    : "var(--text-muted)";

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={onClick}
      className="group relative text-left"
      style={{
        flex:    "1 1 110px",
        minWidth: 0,
        cursor:  onClick ? "pointer" : "default",
      }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick  ? { scale: 0.98 } : undefined}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] transition-opacity duration-200"
        style={{ backgroundColor: accentColor, opacity: 0.7 }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
        style={{ boxShadow: `inset 0 0 20px ${accentColor}18` }}
      />

      {/* Card body */}
      <div
        className="relative flex flex-col gap-1 px-3 pb-2.5 pt-3"
        style={{
          border:          "1px solid var(--border-default)",
          borderTop:       "none",
          backgroundColor: "var(--bg-panel)",
        }}
      >
        {/* Label row */}
        <div className="flex items-center justify-between gap-1">
          <span
            className="font-data text-[8px] uppercase tracking-[0.16em] truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          {/* Live pulse dot */}
          <span
            className="blink h-1 w-1 shrink-0 rounded-full opacity-60"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Value */}
        <span
          className="font-data text-base tabular-nums leading-none truncate transition-colors duration-150"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>

        {/* Change */}
        {change !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className="font-data text-[9px] tabular-nums tracking-[0.04em]"
              style={{ color: changeColor }}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {change > 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Bottom accent line — appears on hover */}
        {onClick && (
          <div
            className="absolute inset-x-0 bottom-0 h-[1px] scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>
    </motion.button>
  );
}
