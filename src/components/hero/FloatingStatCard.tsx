"use client";

import { motion } from "motion/react";

type FloatingStatCardProps = {
  label: string;
  value: string;
  change?: number;
  status?: "live" | "alert" | "sync";
  delay?: number;
};

const statusBorderColor = {
  live:  "var(--signal-green)",
  alert: "var(--signal-red)",
  sync:  "var(--signal-cyan)",
};

export function FloatingStatCard({
  label,
  value,
  change,
  status = "live",
  delay = 0,
}: FloatingStatCardProps) {
  const borderColor = statusBorderColor[status];
  const changeColor =
    change === undefined
      ? "var(--text-secondary)"
      : change > 0
      ? "var(--signal-green)"
      : change < 0
      ? "var(--signal-red)"
      : "var(--text-muted)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="panel flex flex-col gap-0.5 px-3 py-2"
      style={{
        borderLeft: `2px solid ${borderColor}`,
        minWidth: 110,
      }}
    >
      <span className="font-data text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </span>
      <span className="font-data text-sm tabular-nums text-[var(--text-primary)]">{value}</span>
      {change !== undefined && (
        <span className="font-data text-[10px] tabular-nums" style={{ color: changeColor }}>
          {change > 0 ? "+" : ""}{change.toFixed(2)}%
        </span>
      )}
    </motion.div>
  );
}
