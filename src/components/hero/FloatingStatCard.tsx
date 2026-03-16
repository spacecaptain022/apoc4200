"use client";

import { motion } from "motion/react";
import { BarChart2 } from "lucide-react";

type FloatingStatCardProps = {
  label: string;
  value: string;
  change?: number;
  status?: "live" | "alert" | "sync";
  delay?: number;
  onClick?: () => void;
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
  onClick,
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
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className="panel group relative flex flex-col gap-0.5 px-3 py-2 text-left transition-all duration-150"
      style={{
        borderLeft:  `2px solid ${borderColor}`,
        minWidth:     0,
        flex:         "1 1 100px",
        cursor:       onClick ? "pointer" : "default",
      }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      <span className="font-data text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)] truncate">
        {label}
      </span>
      <span className="font-data text-sm tabular-nums text-[var(--text-primary)] truncate">{value}</span>
      {change !== undefined && (
        <span className="font-data text-[10px] tabular-nums" style={{ color: changeColor }}>
          {change > 0 ? "+" : ""}{change.toFixed(2)}%
        </span>
      )}

      {/* Chart icon — visible on hover */}
      {onClick && (
        <span
          className="absolute right-2 top-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{ color: borderColor }}
        >
          <BarChart2 size={11} />
        </span>
      )}
    </motion.button>
  );
}
