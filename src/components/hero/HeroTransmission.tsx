"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Radio } from "lucide-react";
import { LiveBadge } from "./LiveBadge";
import { RotatingSignalWindow } from "./RotatingSignalWindow";
import { FloatingStatCard } from "./FloatingStatCard";
import { ChartModal } from "@/components/market/ChartModal";
import { useMarketStore } from "@/store/market-store";
import { formatPrice } from "@/lib/formatting/prices";
import { getTVSymbol, type ChartAsset } from "@/lib/chart-symbols";
import { useReaderCount } from "@/lib/hooks/useReaderCount";

function useLiveStatCards() {
  const crypto = useMarketStore((s) => s.crypto);
  const stocks = useMarketStore((s) => s.stocks);

  const btc  = crypto.find((c) => c.symbol === "BTC");
  const sol  = crypto.find((c) => c.symbol === "SOL");
  const zec  = crypto.find((c) => c.symbol === "ZEC");
  const spy  = stocks.find((s) => s.symbol === "SPY");
  const vix  = stocks.find((s) => s.symbol === "VIX");
  const nvda = stocks.find((s) => s.symbol === "NVDA");

  return [
    {
      label:  "BTC / USD",
      value:  btc?.price ? formatPrice(btc.price) : "—",
      change: btc?.change24h,
      status: (btc?.change24h ?? 0) < 0 ? ("alert" as const) : ("live" as const),
    },
    {
      label:  "SOL / USD",
      value:  sol?.price ? formatPrice(sol.price) : "—",
      change: sol?.change24h,
      status: (sol?.change24h ?? 0) < 0 ? ("alert" as const) : ("live" as const),
    },
    {
      label:  "ZEC / USD",
      value:  zec?.price ? formatPrice(zec.price) : "—",
      change: zec?.change24h,
      status: (zec?.change24h ?? 0) < 0 ? ("alert" as const) : ("live" as const),
    },
    {
      label:  "SPY",
      value:  spy?.price ? formatPrice(spy.price) : "—",
      change: spy?.change24h,
      status: (spy?.change24h ?? 0) < 0 ? ("alert" as const) : ("live" as const),
    },
    {
      label:  "VIX",
      value:  vix?.price ? vix.price.toFixed(2) : "—",
      change: vix?.change24h,
      status: (vix?.price ?? 0) > 25 ? ("alert" as const) : ("sync" as const),
    },
    {
      label:  "NVDA",
      value:  nvda?.price ? formatPrice(nvda.price) : "—",
      change: nvda?.change24h,
      status: (nvda?.change24h ?? 0) < 0 ? ("alert" as const) : ("live" as const),
    },
  ];
}

const ACCENT_COLORS: Record<string, string> = {
  "BTC / USD": "var(--signal-amber)",
  "SOL / USD": "var(--signal-cyan)",
  "ZEC / USD": "#a78bfa",
  "SPY":       "var(--signal-green)",
  "VIX":       "var(--signal-red)",
  "NVDA":      "var(--signal-green)",
};

export function HeroTransmission() {
  const statCards   = useLiveStatCards();
  const readerCount = useReaderCount();
  const [selectedAsset, setSelectedAsset] = useState<ChartAsset | null>(null);

  return (
    <>
    <section
      className="relative w-full overflow-hidden"
      style={{
        borderBottom: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-base)",
        // dvh respects mobile browser chrome; fallback to vh
        minHeight: "calc(100dvh - 84px)",
      }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">

          {/* Left — editorial */}
          <div className="flex flex-col justify-center gap-5 lg:col-span-7 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LiveBadge label="EMERGENCY BROADCAST" color="red" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-broadcast leading-[0.9] tracking-[0.06em]"
              style={{
                // More controlled clamp — 44px mobile floor, 112px desktop ceiling
                fontSize: "clamp(44px, 9vw, 112px)",
                color: "var(--text-primary)",
              }}
            >
              SIGNAL
              <br />
              <span style={{ color: "var(--signal-green)" }}>ACQUIRED</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="font-data max-w-xl text-xs leading-relaxed sm:text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Real-time narratives, market war zones, and live degen telemetry.
              <br />
              <span style={{ color: "var(--text-muted)" }}>
                The news is theater. The signal is here.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/news"
                className="flex items-center gap-2 border px-4 py-2.5 font-data text-[11px] tracking-[0.12em] uppercase transition-all duration-150 sm:px-5"
                style={{
                  borderColor: "var(--signal-green)",
                  color: "var(--signal-green)",
                  backgroundColor: "rgba(92,255,92,0.06)",
                }}
              >
                ENTER THE FEED
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/alerts"
                className="flex items-center gap-2 border px-4 py-2.5 font-data text-[11px] tracking-[0.12em] uppercase transition-all duration-150 sm:px-5"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                <Radio size={12} />
                JOIN ALERTS
              </Link>

              {/* Reader count */}
              {readerCount !== null && (
                <motion.span
                  key={readerCount}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.1em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="blink inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--signal-green)" }}
                  />
                  {readerCount} OPERATIVES MONITORING
                </motion.span>
              )}
            </motion.div>

            {/* Stat cards — 2-col on mobile, wrap on larger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-3 gap-2 pt-1 sm:grid-cols-3 lg:flex lg:flex-wrap"
            >
              {statCards.map((card, i) => (
                <FloatingStatCard
                  key={card.label}
                  {...card}
                  delay={0.5 + i * 0.08}
                  onClick={() =>
                    setSelectedAsset({
                      label:       card.label,
                      value:       card.value,
                      change:      card.change,
                      tvSymbol:    getTVSymbol(card.label),
                      accentColor: ACCENT_COLORS[card.label] ?? "var(--signal-green)",
                    })
                  }
                />
              ))}
            </motion.div>
          </div>

          {/* Right — rotating signal window */}
          <div className="lg:col-span-5">
            <RotatingSignalWindow />
          </div>
        </div>
      </div>
    </section>

    <ChartModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  );
}
