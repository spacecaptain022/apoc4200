"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";
import { DataLabel } from "@/components/ui/DataLabel";
import { Timestamp } from "@/components/ui/Timestamp";
import type { ChartAsset } from "@/lib/chart-symbols";

type ChartModalProps = {
  asset: ChartAsset | null;
  onClose: () => void;
};

const INTERVALS = [
  { label: "1H",  tv: "60" },
  { label: "4H",  tv: "240" },
  { label: "1D",  tv: "D" },
  { label: "1W",  tv: "W" },
  { label: "1M",  tv: "M" },
];

export function ChartModal({ asset, onClose }: ChartModalProps) {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef("D");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (asset) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [asset]);

  const buildEmbedUrl = (tvSymbol: string, interval: string) =>
    `https://s.tradingview.com/widgetembed/` +
    `?symbol=${encodeURIComponent(tvSymbol)}` +
    `&interval=${interval}` +
    `&hidesidetoolbar=0` +
    `&hidetoptoolbar=0` +
    `&saveimage=0` +
    `&theme=dark` +
    `&style=1` +
    `&timezone=exchange` +
    `&withdateranges=1` +
    `&toolbarbg=0a0a0a` +
    `&studies=[]` +
    `&locale=en`;

  const changeColor =
    !asset?.change
      ? "var(--text-muted)"
      : asset.change > 0
      ? "var(--signal-green)"
      : "var(--signal-red)";

  const ChangeIcon =
    !asset?.change
      ? Minus
      : asset.change > 0
      ? TrendingUp
      : TrendingDown;

  return (
    <AnimatePresence>
      {asset && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200]"
            style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-3 top-[72px] z-[201] mx-auto sm:inset-x-6 sm:bottom-6 sm:top-[80px] lg:inset-x-auto lg:left-1/2 lg:top-[84px] lg:bottom-8 lg:w-[900px] lg:-translate-x-1/2"
          >
            <CornerMarkers color={asset.accentColor} className="h-full">
              <div
                className="flex h-full flex-col overflow-hidden"
                style={{
                  border:          `1px solid ${asset.accentColor}`,
                  backgroundColor: "var(--bg-base)",
                  boxShadow:       `0 0 40px ${asset.accentColor}22`,
                }}
              >
                {/* Header */}
                <div
                  className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3"
                  style={{
                    borderColor:     "var(--border-default)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  {/* Asset info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="blink inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: asset.accentColor }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-broadcast text-xl tracking-[0.08em] sm:text-2xl"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {asset.label}
                        </span>
                        <span
                          className="font-data text-lg tabular-nums sm:text-xl"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {asset.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ChangeIcon size={11} style={{ color: changeColor }} />
                        <span className="font-data text-xs tabular-nums" style={{ color: changeColor }}>
                          {asset.change !== undefined
                            ? `${asset.change > 0 ? "+" : ""}${asset.change.toFixed(2)}%`
                            : "—"}
                        </span>
                        <span style={{ color: "var(--border-strong)" }} className="ml-1">·</span>
                        <DataLabel className="hidden sm:inline">{asset.tvSymbol}</DataLabel>
                      </div>
                    </div>
                  </div>

                  {/* Right: interval selector + timestamp + close */}
                  <div className="flex shrink-0 items-center gap-2">
                    {/* Interval tabs */}
                    <div className="hidden items-center gap-1 sm:flex">
                      {INTERVALS.map((iv) => (
                        <button
                          key={iv.tv}
                          onClick={() => {
                            intervalRef.current = iv.tv;
                            if (iframeRef.current) {
                              iframeRef.current.src = buildEmbedUrl(asset.tvSymbol, iv.tv);
                            }
                          }}
                          className="border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.1em] transition-all duration-150"
                          style={{
                            borderColor:     "var(--border-subtle)",
                            color:           "var(--text-muted)",
                            backgroundColor: "transparent",
                          }}
                        >
                          {iv.label}
                        </button>
                      ))}
                    </div>

                    <Timestamp className="hidden sm:inline" />

                    <button
                      onClick={onClose}
                      className="flex h-7 w-7 items-center justify-center border transition-colors duration-150"
                      style={{
                        borderColor:     "var(--border-default)",
                        color:           "var(--text-muted)",
                        backgroundColor: "var(--bg-panel)",
                      }}
                      aria-label="Close chart"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Mobile interval row */}
                <div
                  className="flex shrink-0 items-center gap-1 border-b px-3 py-2 sm:hidden"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
                >
                  {INTERVALS.map((iv) => (
                    <button
                      key={iv.tv}
                      onClick={() => {
                        intervalRef.current = iv.tv;
                        if (iframeRef.current) {
                          iframeRef.current.src = buildEmbedUrl(asset.tvSymbol, iv.tv);
                        }
                      }}
                      className="border px-2.5 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-all duration-150"
                      style={{
                        borderColor:     "var(--border-subtle)",
                        color:           "var(--text-muted)",
                        backgroundColor: "transparent",
                      }}
                    >
                      {iv.label}
                    </button>
                  ))}
                </div>

                {/* TradingView chart iframe */}
                <div className="relative min-h-0 flex-1">
                  <iframe
                    ref={iframeRef}
                    src={buildEmbedUrl(asset.tvSymbol, "D")}
                    className="h-full w-full"
                    style={{ border: "none", display: "block" }}
                    title={`${asset.label} chart`}
                    allow="fullscreen"
                  />
                  {/* Scanline overlay on chart */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)",
                    }}
                  />
                </div>

                {/* Footer */}
                <div
                  className="flex shrink-0 items-center justify-between border-t px-4 py-2"
                  style={{
                    borderColor:     "var(--border-subtle)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <DataLabel>POWERED BY TRADINGVIEW</DataLabel>
                  <DataLabel>ESC TO CLOSE</DataLabel>
                </div>
              </div>
            </CornerMarkers>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
