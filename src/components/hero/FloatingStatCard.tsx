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

const NOTCH = 11; // px

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

  // Shape: notch top-right for up, bottom-right for down, square for neutral
  const clipPath = isUp
    ? `polygon(0 0, calc(100% - ${NOTCH}px) 0, 100% ${NOTCH}px, 100% 100%, 0 100%)`
    : isDown
    ? `polygon(0 0, 100% 0, 100% calc(100% - ${NOTCH}px), calc(100% - ${NOTCH}px) 100%, 0 100%)`
    : undefined;

  // Accent line position: top for up, bottom for down
  const accentLineStyle = isDown
    ? { bottom: 0, top: "auto" }
    : { top: 0 };

  // Directional background texture
  const diagonalBg = isUp
    ? `repeating-linear-gradient(45deg, transparent, transparent 6px, ${accentColor}07 6px, ${accentColor}07 7px)`
    : isDown
    ? `repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,60,60,0.06) 6px, rgba(255,60,60,0.06) 7px)`
    : undefined;

  // Directional ambient glow direction
  const ambientGlow = isUp
    ? `linear-gradient(to top, ${accentColor}12 0%, transparent 60%)`
    : isDown
    ? `linear-gradient(to bottom, rgba(255,60,60,0.1) 0%, transparent 60%)`
    : undefined;

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
        flex:     "1 1 110px",
        minWidth: 0,
        cursor:   onClick ? "pointer" : "default",
        clipPath,
      }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick   ? { scale: 0.98 } : undefined}
    >
      {/* Accent edge line */}
      <div
        className="absolute inset-x-0 h-[1px] pointer-events-none"
        style={{ ...accentLineStyle, backgroundColor: accentColor, opacity: 0.8 }}
      />

      {/* Directional ambient fill */}
      {ambientGlow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: ambientGlow }}
        />
      )}

      {/* Diagonal texture */}
      {diagonalBg && (
        <div
          className="absolute inset-0 pointer-events-none opacity-100"
          style={{ backgroundImage: diagonalBg }}
        />
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
        style={{ boxShadow: `inset 0 0 24px ${accentColor}1a` }}
      />

      {/* Card body */}
      <div
        className="relative flex flex-col gap-1 px-3 pb-3 pt-2.5"
        style={{
          border:          "1px solid var(--border-default)",
          borderTop:       isDown ? undefined : "none",
          borderBottom:    isDown ? "none" : undefined,
          backgroundColor: "var(--bg-panel)",
        }}
      >
        {/* Label + dot row */}
        <div className="flex items-center justify-between gap-1">
          <span
            className="font-data text-[8px] uppercase tracking-[0.16em] truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <span
            className={`h-1 w-1 shrink-0 rounded-full ${isDown ? "animate-[pulse_0.8s_ease-in-out_infinite]" : "blink"}`}
            style={{
              backgroundColor: isDown ? "var(--signal-red)" : accentColor,
              opacity: 0.7,
            }}
          />
        </div>

        {/* Value */}
        <span
          className="font-data text-base tabular-nums leading-none truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>

        {/* Change badge */}
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="font-data text-[9px] tabular-nums tracking-[0.04em] px-1 py-px"
              style={{
                color:           changeColor,
                backgroundColor: isUp
                  ? `${accentColor}14`
                  : isDown
                  ? "rgba(255,60,60,0.1)"
                  : "transparent",
                border:          `1px solid ${changeColor}40`,
              }}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {change > 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Hover sweep line — on opposite edge from accent */}
        {onClick && (
          <div
            className="absolute inset-x-0 h-[1px] scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 pointer-events-none"
            style={{
              ...(isDown ? { top: 0 } : { bottom: 0 }),
              backgroundColor: accentColor,
              opacity: 0.5,
            }}
          />
        )}
      </div>
    </motion.button>
  );
}
