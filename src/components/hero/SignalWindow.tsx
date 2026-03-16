"use client";

import { motion } from "motion/react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";
import { DataLabel } from "@/components/ui/DataLabel";
import { Timestamp } from "@/components/ui/Timestamp";

type SignalWindowProps = {
  src?: string;
  alt?: string;
  label?: string;
  isGif?: boolean;
};

export function SignalWindow({
  src,
  alt = "Signal feed",
  label = "LIVE FEED",
}: SignalWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full"
    >
      <CornerMarkers color="var(--signal-green)">
        <div
          className="relative overflow-hidden"
          style={{
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-panel)",
            aspectRatio: "16/10",
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between border-b px-3 py-1.5"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <DataLabel>{label}</DataLabel>
            <Timestamp />
          </div>

          {/* Media area */}
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              style={{ display: "block" }}
            />
          ) : (
            /* Placeholder — replace with real media */
            <div
              className="flex h-full flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "var(--bg-elevated)", minHeight: 240 }}
            >
              <StaticPlaceholder />
              <span
                className="font-data text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "var(--text-muted)" }}
              >
                SIGNAL INCOMING
              </span>
            </div>
          )}

          {/* Scanline overlay on the window itself */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />
        </div>
      </CornerMarkers>
    </motion.div>
  );
}

function StaticPlaceholder() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="4" height="4" fill="rgba(92,255,92,0.3)" />
      <rect x="8" y="4" width="4" height="4" fill="rgba(92,255,92,0.15)" />
      <rect x="16" y="0" width="4" height="4" fill="rgba(92,255,92,0.25)" />
      <rect x="24" y="4" width="4" height="4" fill="rgba(92,255,92,0.1)" />
      <rect x="32" y="0" width="4" height="4" fill="rgba(92,255,92,0.2)" />
      <rect x="40" y="4" width="4" height="4" fill="rgba(92,255,92,0.3)" />
      <rect x="4" y="8" width="4" height="4" fill="rgba(92,255,92,0.2)" />
      <rect x="12" y="12" width="4" height="4" fill="rgba(92,255,92,0.35)" />
      <rect x="20" y="8" width="4" height="4" fill="rgba(92,255,92,0.15)" />
      <rect x="28" y="12" width="4" height="4" fill="rgba(92,255,92,0.25)" />
      <rect x="36" y="8" width="4" height="4" fill="rgba(92,255,92,0.1)" />
      <rect x="44" y="12" width="4" height="4" fill="rgba(92,255,92,0.3)" />
    </svg>
  );
}
