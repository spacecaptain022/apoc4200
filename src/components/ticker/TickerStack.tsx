"use client";

import { useMarketStore } from "@/store/market-store";
import { useMarketData } from "@/lib/hooks/useMarketData";
import { formatPrice, formatChange } from "@/lib/formatting/prices";
import { TickerBand } from "./TickerBand";
import { TickerItem } from "./TickerItem";
import type { MarketAsset } from "@/app/api/markets/crypto/route";
import { useState, useEffect } from "react";
import type { NewsArticle } from "@/app/api/news/route";

const FALLBACK_HEADLINES = [
  "LIVE NEWS FEED LOADING — STAND BY",
  "MARKETS OPEN — MONITORING ALL CHANNELS",
  "SIGNAL ACQUIRED — SCANNING GLOBAL FEEDS",
];

function useNewsHeadlines() {
  const [headlines, setHeadlines] = useState<string[]>(FALLBACK_HEADLINES);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) return;
        const data = await res.json();
        const titles: string[] = (data.articles as NewsArticle[])
          .slice(0, 20)
          .map((a) => a.title);
        if (titles.length > 0) setHeadlines(titles);
      } catch {
        // keep fallback
      }
    }
    load();
    const id = setInterval(load, 5 * 60_000); // refresh every 5 min
    return () => clearInterval(id);
  }, []);

  return headlines;
}

// Fallback items shown before first fetch completes
const CRYPTO_FALLBACK: MarketAsset[] = [
  { symbol: "BTC", name: "Bitcoin",  price: 0, change24h: 0 },
  { symbol: "ETH", name: "Ethereum", price: 0, change24h: 0 },
  { symbol: "SOL", name: "Solana",   price: 0, change24h: 0 },
];

const STOCKS_FALLBACK: MarketAsset[] = [
  { symbol: "SPY",  name: "S&P 500",  price: 0, change24h: 0 },
  { symbol: "QQQ",  name: "Nasdaq",   price: 0, change24h: 0 },
  { symbol: "NVDA", name: "Nvidia",   price: 0, change24h: 0 },
];

function assetToTickerProps(a: MarketAsset) {
  return {
    label:  a.symbol,
    value:  a.price > 0 ? formatPrice(a.price) : "—",
    change: a.price > 0 ? a.change24h : undefined,
  };
}

// Pull out signal metrics from the stocks array
function getSignalItems(stocks: MarketAsset[]) {
  const find = (sym: string) => stocks.find((s) => s.symbol === sym || s.symbol === sym.replace("^", ""));
  const vix    = find("VIX");
  const gold   = find("GLD");
  const silver = find("SLV");
  const copper = find("CPER");
  const oil    = find("USO");
  const dow    = find("DJI");

  return [
    vix    && { label: "VIX",    value: vix.price > 0    ? formatPrice(vix.price)    : "—", change: vix.change24h },
    gold   && { label: "GOLD",   value: gold.price > 0   ? formatPrice(gold.price)   : "—", change: gold.change24h },
    silver && { label: "SILVER", value: silver.price > 0 ? formatPrice(silver.price) : "—", change: silver.change24h },
    copper && { label: "COPPER", value: copper.price > 0 ? formatPrice(copper.price) : "—", change: copper.change24h },
    oil    && { label: "OIL",    value: oil.price > 0    ? formatPrice(oil.price)    : "—", change: oil.change24h },
    dow    && { label: "DOW",    value: dow.price > 0    ? formatPrice(dow.price)    : "—", change: dow.change24h },
  ].filter(Boolean) as Array<{ label: string; value: string; change: number }>;
}

export function TickerStack() {
  // Start polling
  useMarketData({ cryptoInterval: 30_000, stocksInterval: 60_000 });
  const headlines = useNewsHeadlines();

  const crypto = useMarketStore((s) => s.crypto);
  const stocks = useMarketStore((s) => s.stocks);
  const cryptoState = useMarketStore((s) => s.cryptoState);
  const stocksState = useMarketStore((s) => s.stocksState);

  const cryptoItems = crypto.length > 0 ? crypto : CRYPTO_FALLBACK;
  // Filter out index symbols (VIX, GLD, USO, DJI) from the main stocks band
  const stockItems =
    stocks.length > 0
      ? stocks.filter((s) => !["VIX", "GLD", "SLV", "CPER", "USO", "DJI"].includes(s.symbol))
      : STOCKS_FALLBACK;
  const signalItems = getSignalItems(stocks);

  return (
    <div className="w-full">
      {/* Band 1: Crypto — left scroll */}
      <TickerBand
        label={cryptoState === "loading" ? "SYNCING" : "CRYPTO"}
        labelColor="var(--signal-cyan)"
        speed={38}
        direction="left"
        borderTop
      >
        {cryptoItems.map((item) => (
          <TickerItem key={item.symbol} separator {...assetToTickerProps(item)} />
        ))}
      </TickerBand>

      {/* Band 2: Stocks — right scroll, different speed */}
      <TickerBand
        label={stocksState === "loading" ? "SYNCING" : "MARKETS"}
        labelColor="var(--signal-amber)"
        speed={30}
        direction="right"
      >
        {stockItems.map((item) => (
          <TickerItem key={item.symbol} separator {...assetToTickerProps(item)} />
        ))}
      </TickerBand>

      {/* Band 3: Live headlines */}
      <TickerBand label="LIVE" labelColor="var(--signal-red)" speed={55} direction="left">
        {headlines.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-4 font-data text-[11px] whitespace-nowrap"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="blink h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--signal-red)" }}
            />
            {text}
            <span style={{ color: "var(--border-strong)" }}>·</span>
          </span>
        ))}
      </TickerBand>

      {/* Band 4: Signal metrics (VIX, Gold, Oil, Dow) — right */}
      {signalItems.length > 0 && (
        <TickerBand label="SIGNAL" labelColor="var(--signal-green)" speed={24} direction="right">
          {signalItems.map((item) => (
            <TickerItem key={item.label} separator {...item} />
          ))}
        </TickerBand>
      )}
    </div>
  );
}
