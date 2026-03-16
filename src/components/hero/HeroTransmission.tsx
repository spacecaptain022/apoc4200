"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Radio } from "lucide-react";
import { LiveBadge } from "./LiveBadge";
import { SignalWindow } from "./SignalWindow";
import { FloatingStatCard } from "./FloatingStatCard";
import { useMarketStore } from "@/store/market-store";
import { formatPrice } from "@/lib/formatting/prices";

function useLiveStatCards() {
  const crypto = useMarketStore((s) => s.crypto);
  const stocks = useMarketStore((s) => s.stocks);

  const btc  = crypto.find((c) => c.symbol === "BTC");
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

export function HeroTransmission() {
  const statCards = useLiveStatCards();
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        borderBottom: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-base)",
        minHeight: "calc(100vh - 84px)",
      }}
    >
      {/* Background grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Left column — editorial */}
          <div className="flex flex-col justify-center gap-6 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <LiveBadge label="EMERGENCY BROADCAST" color="red" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-broadcast leading-[0.9] tracking-[0.06em]"
              style={{
                fontSize: "clamp(56px, 8vw, 112px)",
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
              className="font-data max-w-xl text-sm leading-relaxed"
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
                className="flex items-center gap-2 border px-5 py-2.5 font-data text-[11px] tracking-[0.12em] uppercase transition-all duration-150"
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
                className="flex items-center gap-2 border px-5 py-2.5 font-data text-[11px] tracking-[0.12em] uppercase transition-all duration-150"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                <Radio size={12} />
                JOIN ALERTS
              </Link>
            </motion.div>

            {/* Stat cards row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {statCards.map((card, i) => (
                <FloatingStatCard key={card.label} {...card} delay={0.5 + i * 0.08} />
              ))}
            </motion.div>
          </div>

          {/* Right column — signal window */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            <SignalWindow label="LIVE SIGNAL FEED" />

            {/* Category tag strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex flex-wrap gap-2"
            >
              {["MARKETS", "CRYPTO", "GEOPOLITICS", "MACRO", "DEGEN"].map((tag) => (
                <span
                  key={tag}
                  className="border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.12em]"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
