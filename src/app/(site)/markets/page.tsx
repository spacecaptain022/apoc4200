"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BroadcastShell } from "@/components/layout/BroadcastShell";
import type { DexPair } from "@/app/api/dex/route";

// ── Helpers ──────────────────────────────────────────────────────────────────

const CHAIN_COLORS: Record<string, string> = {
  solana:   "#9945ff",
  ethereum: "#627eea",
  base:     "#0052ff",
  bsc:      "#f0b90b",
  arbitrum: "#28a0f0",
  polygon:  "#8247e5",
  avalanche:"#e84142",
  fantom:   "#1969ff",
};

const CHAIN_LABELS: Record<string, string> = {
  solana:   "SOL",
  ethereum: "ETH",
  base:     "BASE",
  bsc:      "BSC",
  arbitrum: "ARB",
  polygon:  "MATIC",
  avalanche:"AVAX",
  fantom:   "FTM",
};

function fmtPrice(p: string | number): string {
  const n = typeof p === "string" ? parseFloat(p) : p;
  if (!n || isNaN(n)) return "—";
  if (n >= 1_000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 1)     return `$${n.toFixed(4)}`;
  if (n >= 0.0001)return `$${n.toFixed(6)}`;
  return `$${n.toExponential(3)}`;
}

function fmtCompact(n?: number): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtChange(n?: number): string {
  if (n === undefined || n === null) return "—";
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

// ── Token row ─────────────────────────────────────────────────────────────────

function PairRow({ pair, rank }: { pair: DexPair; rank: number }) {
  const change24 = pair.priceChange?.h24;
  const isUp     = change24 !== undefined && change24 > 0;
  const isDown   = change24 !== undefined && change24 < 0;
  const changeColor = isUp ? "var(--signal-green)" : isDown ? "var(--signal-red)" : "var(--text-muted)";
  const ChIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const chainColor = CHAIN_COLORS[pair.chainId] ?? "var(--text-muted)";
  const chainLabel = CHAIN_LABELS[pair.chainId] ?? pair.chainId.toUpperCase().slice(0, 4);

  return (
    <a
      href={pair.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid items-center gap-x-4 border-b px-4 py-3 transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
      style={{
        borderColor: "var(--border-subtle)",
        gridTemplateColumns: "28px 1fr 100px 90px 90px 90px 80px 28px",
      }}
    >
      {/* Rank */}
      <span className="font-data text-[10px] tabular-nums text-right" style={{ color: "var(--text-muted)" }}>
        {rank}
      </span>

      {/* Token info */}
      <div className="flex min-w-0 items-center gap-2.5">
        {pair.info?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pair.info.imageUrl}
            alt={pair.baseToken.symbol}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
            style={{ border: "1px solid var(--border-subtle)" }}
          />
        ) : (
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center text-[9px] font-bold"
            style={{
              backgroundColor: `${chainColor}22`,
              border:          `1px solid ${chainColor}44`,
              color:           chainColor,
            }}
          >
            {pair.baseToken.symbol.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-broadcast text-sm tracking-[0.06em] truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {pair.baseToken.symbol}
            </span>
            <span
              className="shrink-0 font-data text-[8px] px-1 py-px uppercase"
              style={{
                color:           chainColor,
                backgroundColor: `${chainColor}18`,
                border:          `1px solid ${chainColor}40`,
              }}
            >
              {chainLabel}
            </span>
          </div>
          <span
            className="block truncate font-data text-[9px]"
            style={{ color: "var(--text-muted)" }}
          >
            {pair.baseToken.name} / {pair.quoteToken.symbol}
          </span>
        </div>
      </div>

      {/* Price */}
      <span
        className="font-data text-sm tabular-nums text-right"
        style={{ color: "var(--text-primary)" }}
      >
        {fmtPrice(pair.priceUsd)}
      </span>

      {/* 1h change */}
      <span
        className="font-data text-xs tabular-nums text-right"
        style={{ color: pair.priceChange?.h1 !== undefined
          ? pair.priceChange.h1 > 0 ? "var(--signal-green)" : pair.priceChange.h1 < 0 ? "var(--signal-red)" : "var(--text-muted)"
          : "var(--text-muted)" }}
      >
        {fmtChange(pair.priceChange?.h1)}
      </span>

      {/* 24h change */}
      <div className="flex items-center justify-end gap-1">
        <ChIcon size={10} style={{ color: changeColor, flexShrink: 0 }} />
        <span className="font-data text-xs tabular-nums" style={{ color: changeColor }}>
          {fmtChange(change24)}
        </span>
      </div>

      {/* 24h volume */}
      <span
        className="font-data text-xs tabular-nums text-right"
        style={{ color: "var(--text-secondary)" }}
      >
        {fmtCompact(pair.volume?.h24)}
      </span>

      {/* Liquidity */}
      <span
        className="font-data text-xs tabular-nums text-right"
        style={{ color: "var(--text-muted)" }}
      >
        {fmtCompact(pair.liquidity?.usd)}
      </span>

      {/* External link */}
      <ExternalLink
        size={11}
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ color: "var(--text-muted)" }}
      />
    </a>
  );
}

// ── Table header ──────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div
      className="grid items-center gap-x-4 border-b px-4 py-2"
      style={{
        borderColor:     "var(--border-default)",
        backgroundColor: "var(--bg-elevated)",
        gridTemplateColumns: "28px 1fr 100px 90px 90px 90px 80px 28px",
      }}
    >
      {["#", "PAIR", "PRICE", "1H", "24H", "VOL 24H", "LIQUIDITY", ""].map((h, i) => (
        <span
          key={i}
          className={`font-data text-[9px] uppercase tracking-[0.14em] ${i > 1 ? "text-right" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          {h}
        </span>
      ))}
    </div>
  );
}

// ── Chain filter pills ────────────────────────────────────────────────────────

const CHAINS = ["ALL", "solana", "ethereum", "base", "bsc", "arbitrum"];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [pairs, setPairs]       = useState<DexPair[]>([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");
  const [chain, setChain]       = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q ? `/api/dex?q=${encodeURIComponent(q)}` : "/api/dex";
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setPairs(data.pairs ?? []);
      setLastUpdated(data.ts);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh trending every 30s
  useEffect(() => {
    if (!query) {
      load("");
      const id = setInterval(() => load(""), 30_000);
      return () => clearInterval(id);
    }
  }, [query, load]);

  // Debounced search
  const handleSearch = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val), 400);
  };

  const filtered = chain === "ALL"
    ? pairs
    : pairs.filter((p) => p.chainId === chain);

  const chainCounts = CHAINS.reduce<Record<string, number>>((acc, c) => {
    acc[c] = c === "ALL" ? pairs.length : pairs.filter((p) => p.chainId === c).length;
    return acc;
  }, {});

  return (
    <BroadcastShell>
      <div className="mx-auto max-w-[1440px] px-4 py-10">

        {/* Header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: "var(--border-default)" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="blink inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--signal-green)" }} />
                <span className="font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--signal-green)" }}>
                  LIVE · DEXSCREENER
                </span>
              </div>
              <h1 className="font-broadcast text-4xl tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>
                TOKEN SCANNER
              </h1>
              <p className="mt-1 font-data text-[11px] tracking-[0.06em]" style={{ color: "var(--text-muted)" }}>
                REAL-TIME DEX PAIRS · SEARCH ANY TOKEN BY NAME OR ADDRESS
              </p>
            </div>
            {lastUpdated && (
              <span className="font-data text-[10px] tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                UPDATED {Math.round((Date.now() - lastUpdated) / 1000)}S AGO
              </span>
            )}
          </div>

          {/* Search */}
          <div
            className="relative mt-5 flex items-center gap-3 border px-4 py-3 transition-colors duration-150 focus-within:border-[var(--signal-green)]"
            style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-panel)" }}
          >
            <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="SEARCH TOKEN NAME, SYMBOL, OR CONTRACT ADDRESS..."
              className="w-full bg-transparent font-data text-sm uppercase tracking-[0.06em] placeholder:text-[var(--text-muted)] focus:outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            {query && (
              <button
                onClick={() => handleSearch("")}
                className="font-data text-[10px] uppercase tracking-[0.1em] shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Chain filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CHAINS.map((c) => {
              const active = chain === c;
              const color  = CHAIN_COLORS[c] ?? "var(--text-secondary)";
              const label  = c === "ALL" ? "ALL CHAINS" : (CHAIN_LABELS[c] ?? c.toUpperCase());
              const count  = chainCounts[c] ?? 0;
              return (
                <button
                  key={c}
                  onClick={() => setChain(c)}
                  className="font-data text-[10px] uppercase tracking-[0.1em] border px-3 py-1.5 transition-all duration-150"
                  style={{
                    borderColor:     active ? (c === "ALL" ? "var(--signal-green)" : color) : "var(--border-default)",
                    color:           active ? (c === "ALL" ? "var(--signal-green)" : color) : "var(--text-muted)",
                    backgroundColor: active ? `color-mix(in srgb, ${c === "ALL" ? "var(--signal-green)" : color} 10%, transparent)` : "transparent",
                  }}
                >
                  {label}
                  {count > 0 && <span className="ml-1.5 opacity-50">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-hidden"
          style={{ border: "1px solid var(--border-default)" }}
        >
          {/* Column headers — hidden on mobile */}
          <div className="hidden lg:block">
            <TableHeader />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="font-broadcast text-xl tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                SCANNING DEX...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <span className="font-broadcast text-xl tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                NO PAIRS FOUND
              </span>
              <span className="font-data text-[11px]" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                TRY A DIFFERENT SYMBOL OR CONTRACT ADDRESS
              </span>
            </div>
          ) : (
            <>
              {/* Desktop rows */}
              <div className="hidden lg:block">
                {filtered.map((pair, i) => (
                  <PairRow key={pair.pairAddress} pair={pair} rank={i + 1} />
                ))}
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {filtered.map((pair) => {
                  const change24 = pair.priceChange?.h24;
                  const isUp  = change24 !== undefined && change24 > 0;
                  const isDown = change24 !== undefined && change24 < 0;
                  const changeColor = isUp ? "var(--signal-green)" : isDown ? "var(--signal-red)" : "var(--text-muted)";
                  const chainColor  = CHAIN_COLORS[pair.chainId] ?? "var(--text-muted)";
                  const chainLabel  = CHAIN_LABELS[pair.chainId] ?? pair.chainId.toUpperCase().slice(0, 4);
                  return (
                    <a
                      key={pair.pairAddress}
                      href={pair.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {pair.info?.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={pair.info.imageUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-[9px] font-bold"
                            style={{ backgroundColor: `${chainColor}22`, border: `1px solid ${chainColor}44`, color: chainColor }}
                          >
                            {pair.baseToken.symbol.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-broadcast text-sm tracking-[0.06em]" style={{ color: "var(--text-primary)" }}>
                              {pair.baseToken.symbol}
                            </span>
                            <span className="font-data text-[8px] px-1 py-px" style={{ color: chainColor, backgroundColor: `${chainColor}18`, border: `1px solid ${chainColor}40` }}>
                              {chainLabel}
                            </span>
                          </div>
                          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
                            VOL {fmtCompact(pair.volume?.h24)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-data text-sm tabular-nums" style={{ color: "var(--text-primary)" }}>
                          {fmtPrice(pair.priceUsd)}
                        </span>
                        <span className="font-data text-[10px] tabular-nums" style={{ color: changeColor }}>
                          {fmtChange(change24)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer attribution */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-data text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
            DATA: DEXSCREENER · REFRESHES EVERY 30S
          </span>
          <a
            href="https://dexscreener.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-data text-[9px] uppercase tracking-[0.1em] transition-opacity duration-150 hover:opacity-100"
            style={{ color: "var(--text-muted)", opacity: 0.5 }}
          >
            DEXSCREENER <ExternalLink size={9} />
          </a>
        </div>

      </div>
    </BroadcastShell>
  );
}
