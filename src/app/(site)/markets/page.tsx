"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Search, ExternalLink, TrendingUp, TrendingDown, Minus,
  Star, ChevronUp, ChevronDown, SlidersHorizontal, X,
} from "lucide-react";
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

const CHAINS = ["ALL", "solana", "ethereum", "base", "bsc", "arbitrum", "polygon", "avalanche", "fantom"];

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

function chgColor(n?: number): string {
  if (n === undefined || n === null) return "var(--text-muted)";
  return n > 0 ? "var(--signal-green)" : n < 0 ? "var(--signal-red)" : "var(--text-muted)";
}

// ── Sort ─────────────────────────────────────────────────────────────────────

type SortCol = "price" | "m5" | "h1" | "h6" | "h24" | "vol1h" | "vol24h" | "mcap" | "txns";

function sortValue(pair: DexPair, col: SortCol): number {
  switch (col) {
    case "price":  return parseFloat(pair.priceUsd) || 0;
    case "m5":     return pair.priceChange?.m5  ?? -Infinity;
    case "h1":     return pair.priceChange?.h1  ?? -Infinity;
    case "h6":     return pair.priceChange?.h6  ?? -Infinity;
    case "h24":    return pair.priceChange?.h24 ?? -Infinity;
    case "vol1h":  return pair.volume?.h1  ?? 0;
    case "vol24h": return pair.volume?.h24 ?? 0;
    case "mcap":   return pair.marketCap ?? pair.fdv ?? 0;
    case "txns":   return (pair.txns?.h24?.buys ?? 0) + (pair.txns?.h24?.sells ?? 0);
  }
}

// ── Grid ─────────────────────────────────────────────────────────────────────

const GRID = "22px 28px 1fr 110px 68px 68px 68px 68px 80px 80px 90px 90px 28px";

// ── TxnBar ───────────────────────────────────────────────────────────────────

function TxnBar({ buys, sells }: { buys: number; sells: number }) {
  const total = buys + sells;
  if (!total) return <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>—</span>;
  const buyPct = (buys / total) * 100;
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1">
        <span className="font-data text-[9px] tabular-nums" style={{ color: "var(--signal-green)" }}>{buys}</span>
        <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>/</span>
        <span className="font-data text-[9px] tabular-nums" style={{ color: "var(--signal-red)" }}>{sells}</span>
      </div>
      <div className="h-[2px] w-12 overflow-hidden rounded-full" style={{ backgroundColor: "var(--signal-red)" }}>
        <div className="h-full rounded-full" style={{ width: `${buyPct}%`, backgroundColor: "var(--signal-green)" }} />
      </div>
    </div>
  );
}

// ── Token row ─────────────────────────────────────────────────────────────────

function PairRow({
  pair, rank, isFavorite, onToggleFavorite,
}: {
  pair: DexPair;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: (addr: string, e: React.MouseEvent) => void;
}) {
  const change24   = pair.priceChange?.h24;
  const isUp       = change24 !== undefined && change24 > 0;
  const isDown     = change24 !== undefined && change24 < 0;
  const c24color   = isUp ? "var(--signal-green)" : isDown ? "var(--signal-red)" : "var(--text-muted)";
  const ChIcon     = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const chainColor = CHAIN_COLORS[pair.chainId] ?? "var(--text-muted)";
  const chainLabel = CHAIN_LABELS[pair.chainId] ?? pair.chainId.toUpperCase().slice(0, 4);
  const txns24     = pair.txns?.h24;

  return (
    <a
      href={pair.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid items-center gap-x-3 border-b px-4 py-3 transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
      style={{ borderColor: "var(--border-subtle)", gridTemplateColumns: GRID }}
    >
      {/* Star */}
      <button
        onClick={(e) => onToggleFavorite(pair.pairAddress, e)}
        className="flex items-center justify-center transition-opacity duration-150"
        style={{ color: isFavorite ? "#f59e0b" : "var(--text-muted)", opacity: isFavorite ? 1 : 0.3 }}
        title={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
      >
        <Star size={10} fill={isFavorite ? "currentColor" : "none"} />
      </button>

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
            style={{ backgroundColor: `${chainColor}22`, border: `1px solid ${chainColor}44`, color: chainColor }}
          >
            {pair.baseToken.symbol.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-broadcast text-sm tracking-[0.06em] truncate" style={{ color: "var(--text-primary)" }}>
              {pair.baseToken.symbol}
            </span>
            <span
              className="shrink-0 font-data text-[8px] px-1 py-px uppercase"
              style={{ color: chainColor, backgroundColor: `${chainColor}18`, border: `1px solid ${chainColor}40` }}
            >
              {chainLabel}
            </span>
          </div>
          <span className="block truncate font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
            {pair.baseToken.name} / {pair.quoteToken.symbol}
          </span>
        </div>
      </div>

      {/* Price */}
      <span className="font-data text-sm tabular-nums text-right" style={{ color: "var(--text-primary)" }}>
        {fmtPrice(pair.priceUsd)}
      </span>

      {/* 5m */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: chgColor(pair.priceChange?.m5) }}>
        {fmtChange(pair.priceChange?.m5)}
      </span>

      {/* 1h */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: chgColor(pair.priceChange?.h1) }}>
        {fmtChange(pair.priceChange?.h1)}
      </span>

      {/* 6h */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: chgColor(pair.priceChange?.h6) }}>
        {fmtChange(pair.priceChange?.h6)}
      </span>

      {/* 24h */}
      <div className="flex items-center justify-end gap-1">
        <ChIcon size={10} style={{ color: c24color, flexShrink: 0 }} />
        <span className="font-data text-xs tabular-nums" style={{ color: c24color }}>
          {fmtChange(change24)}
        </span>
      </div>

      {/* Vol 1h */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: "var(--text-muted)" }}>
        {fmtCompact(pair.volume?.h1)}
      </span>

      {/* Vol 24h */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: "var(--text-secondary)" }}>
        {fmtCompact(pair.volume?.h24)}
      </span>

      {/* Mcap */}
      <span className="font-data text-xs tabular-nums text-right" style={{ color: "var(--text-muted)" }}>
        {fmtCompact(pair.marketCap ?? pair.fdv)}
      </span>

      {/* Txns 24h */}
      <div className="flex justify-end">
        {txns24 ? <TxnBar buys={txns24.buys} sells={txns24.sells} /> : (
          <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>—</span>
        )}
      </div>

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

const HEADER_COLS: { label: string; col?: SortCol; right?: boolean }[] = [
  { label: "" },
  { label: "#" },
  { label: "PAIR" },
  { label: "PRICE",    col: "price",  right: true },
  { label: "5M",       col: "m5",     right: true },
  { label: "1H",       col: "h1",     right: true },
  { label: "6H",       col: "h6",     right: true },
  { label: "24H",      col: "h24",    right: true },
  { label: "VOL 1H",   col: "vol1h",  right: true },
  { label: "VOL 24H",  col: "vol24h", right: true },
  { label: "MCAP",     col: "mcap",   right: true },
  { label: "TXNS 24H", col: "txns",   right: true },
  { label: "" },
];

function TableHeader({
  sortCol, sortDir, onSort,
}: {
  sortCol: SortCol;
  sortDir: "asc" | "desc";
  onSort: (col: SortCol) => void;
}) {
  return (
    <div
      className="grid items-center gap-x-3 border-b px-4 py-2"
      style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-elevated)", gridTemplateColumns: GRID }}
    >
      {HEADER_COLS.map(({ label, col, right }, i) => {
        const active = col && sortCol === col;
        return col ? (
          <button
            key={i}
            onClick={() => onSort(col)}
            className={`flex items-center gap-0.5 font-data text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 ${right ? "justify-end" : ""}`}
            style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            {label}
            {active ? (
              sortDir === "desc" ? <ChevronDown size={8} /> : <ChevronUp size={8} />
            ) : (
              <ChevronDown size={8} className="opacity-20" />
            )}
          </button>
        ) : (
          <span
            key={i}
            className="font-data text-[9px] uppercase tracking-[0.14em]"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ── Filter presets ────────────────────────────────────────────────────────────

const LIQ_PRESETS  = [0, 10_000, 50_000, 100_000, 500_000];
const VOL_PRESETS  = [0, 10_000, 100_000, 1_000_000];
const MCAP_PRESETS = [0, 100_000, 1_000_000, 10_000_000, 100_000_000];

function presetLabel(v: number): string {
  if (v === 0) return "ANY";
  return fmtCompact(v).replace("$", "");
}

function FilterPreset({
  label, options, value, onChange,
}: {
  label: string;
  options: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-data text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((v) => {
          const active = value === v;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              className="font-data text-[10px] px-2.5 py-1 border transition-all duration-150"
              style={{
                borderColor:     active ? "var(--signal-green)" : "var(--border-default)",
                color:           active ? "var(--signal-green)" : "var(--text-muted)",
                backgroundColor: active ? "color-mix(in srgb, var(--signal-green) 10%, transparent)" : "transparent",
              }}
            >
              {presetLabel(v)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [pairs, setPairs]             = useState<DexPair[]>([]);
  const [loading, setLoading]         = useState(true);
  const [query, setQuery]             = useState("");
  const [chain, setChain]             = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [sortCol, setSortCol]         = useState<SortCol>("vol24h");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");
  const [favorites, setFavorites]     = useState<Set<string>>(new Set());
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minLiq, setMinLiq]           = useState(0);
  const [minVol, setMinVol]           = useState(0);
  const [minMcap, setMinMcap]         = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esRef       = useRef<EventSource | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dex-favorites");
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const toggleFavorite = (pairAddress: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(pairAddress)) next.delete(pairAddress);
      else next.add(pairAddress);
      try { localStorage.setItem("dex-favorites", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const connectSSE = useCallback(() => {
    esRef.current?.close();
    setLoading(true);
    const es = new EventSource("/api/dex");
    esRef.current = es;
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setPairs(data.pairs ?? []);
        setLastUpdated(data.ts);
        setLoading(false);
      } catch {}
    };
    es.onerror = () => { setLoading(false); };
  }, []);

  const fetchSearch = useCallback(async (q: string) => {
    esRef.current?.close();
    esRef.current = null;
    setLoading(true);
    try {
      const res = await fetch(`/api/dex?q=${encodeURIComponent(q)}`);
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

  useEffect(() => {
    if (!query) {
      connectSSE();
      return () => { esRef.current?.close(); };
    }
  }, [query, connectSSE]);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val) {
      debounceRef.current = setTimeout(() => fetchSearch(val), 400);
    } else {
      connectSSE();
    }
  };

  // ── Filtered + sorted display list ─────────────────────────────────────────

  const displayed = useMemo(() => {
    let result = chain === "ALL" ? pairs : pairs.filter((p) => p.chainId === chain);
    if (showWatchlist) result = result.filter((p) => favorites.has(p.pairAddress));
    if (minLiq)  result = result.filter((p) => (p.liquidity?.usd ?? 0) >= minLiq);
    if (minVol)  result = result.filter((p) => (p.volume?.h24   ?? 0) >= minVol);
    if (minMcap) result = result.filter((p) => (p.marketCap ?? p.fdv ?? 0) >= minMcap);
    return [...result].sort((a, b) => {
      const av = sortValue(a, sortCol);
      const bv = sortValue(b, sortCol);
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [pairs, chain, showWatchlist, favorites, minLiq, minVol, minMcap, sortCol, sortDir]);

  const chainCounts = useMemo(() =>
    CHAINS.reduce<Record<string, number>>((acc, c) => {
      acc[c] = c === "ALL" ? pairs.length : pairs.filter((p) => p.chainId === c).length;
      return acc;
    }, {}),
  [pairs]);

  const hasActiveFilters = minLiq > 0 || minVol > 0 || minMcap > 0;

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

          {/* Chain filters + controls row */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Watchlist toggle */}
            <button
              onClick={() => setShowWatchlist((v) => !v)}
              className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.1em] border px-3 py-1.5 transition-all duration-150"
              style={{
                borderColor:     showWatchlist ? "#f59e0b" : "var(--border-default)",
                color:           showWatchlist ? "#f59e0b" : "var(--text-muted)",
                backgroundColor: showWatchlist ? "color-mix(in srgb, #f59e0b 10%, transparent)" : "transparent",
              }}
            >
              <Star size={9} fill={showWatchlist ? "currentColor" : "none"} />
              WATCHLIST
              {favorites.size > 0 && <span className="opacity-60">{favorites.size}</span>}
            </button>

            {/* Divider */}
            <div className="h-5 w-px mx-1" style={{ backgroundColor: "var(--border-default)" }} />

            {/* Chain pills */}
            {CHAINS.map((c) => {
              const active = chain === c;
              const color  = CHAIN_COLORS[c] ?? "var(--text-secondary)";
              const label  = c === "ALL" ? "ALL" : (CHAIN_LABELS[c] ?? c.toUpperCase());
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

            {/* Divider */}
            <div className="h-5 w-px mx-1" style={{ backgroundColor: "var(--border-default)" }} />

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 font-data text-[10px] uppercase tracking-[0.1em] border px-3 py-1.5 transition-all duration-150"
              style={{
                borderColor:     showFilters || hasActiveFilters ? "var(--signal-green)" : "var(--border-default)",
                color:           showFilters || hasActiveFilters ? "var(--signal-green)" : "var(--text-muted)",
                backgroundColor: showFilters || hasActiveFilters ? "color-mix(in srgb, var(--signal-green) 10%, transparent)" : "transparent",
              }}
            >
              <SlidersHorizontal size={9} />
              FILTERS
              {hasActiveFilters && <span className="opacity-60">ON</span>}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div
              className="mt-3 border p-5"
              style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-panel)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                  FILTER TOKENS
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setMinLiq(0); setMinVol(0); setMinMcap(0); }}
                    className="flex items-center gap-1 font-data text-[9px] uppercase tracking-[0.1em] transition-opacity hover:opacity-100"
                    style={{ color: "var(--signal-red)", opacity: 0.7 }}
                  >
                    <X size={8} /> RESET FILTERS
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <FilterPreset
                  label="MIN LIQUIDITY"
                  options={LIQ_PRESETS}
                  value={minLiq}
                  onChange={setMinLiq}
                />
                <FilterPreset
                  label="MIN VOL 24H"
                  options={VOL_PRESETS}
                  value={minVol}
                  onChange={setMinVol}
                />
                <FilterPreset
                  label="MIN MARKET CAP"
                  options={MCAP_PRESETS}
                  value={minMcap}
                  onChange={setMinMcap}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-2 flex items-center justify-between">
          <span className="font-data text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
            {displayed.length} PAIR{displayed.length !== 1 ? "S" : ""}
            {showWatchlist ? " · WATCHLIST" : ""}
            {hasActiveFilters ? " · FILTERED" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
          <div className="hidden lg:block">
            <TableHeader sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="font-broadcast text-xl tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                SCANNING DEX...
              </span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <span className="font-broadcast text-xl tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                {showWatchlist && favorites.size === 0 ? "NO WATCHLIST TOKENS" : "NO PAIRS FOUND"}
              </span>
              <span className="font-data text-[11px]" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                {showWatchlist && favorites.size === 0
                  ? "STAR A TOKEN TO ADD IT TO YOUR WATCHLIST"
                  : "TRY ADJUSTING YOUR FILTERS OR SEARCH QUERY"}
              </span>
            </div>
          ) : (
            <>
              {/* Desktop rows */}
              <div className="hidden lg:block">
                {displayed.map((pair, i) => (
                  <PairRow
                    key={pair.pairAddress}
                    pair={pair}
                    rank={i + 1}
                    isFavorite={favorites.has(pair.pairAddress)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {displayed.map((pair) => {
                  const change24   = pair.priceChange?.h24;
                  const isUp       = change24 !== undefined && change24 > 0;
                  const isDown     = change24 !== undefined && change24 < 0;
                  const c          = isUp ? "var(--signal-green)" : isDown ? "var(--signal-red)" : "var(--text-muted)";
                  const chainColor = CHAIN_COLORS[pair.chainId] ?? "var(--text-muted)";
                  const chainLabel = CHAIN_LABELS[pair.chainId] ?? pair.chainId.toUpperCase().slice(0, 4);
                  const fav        = favorites.has(pair.pairAddress);
                  return (
                    <a
                      key={pair.pairAddress}
                      href={pair.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <button
                        onClick={(e) => toggleFavorite(pair.pairAddress, e)}
                        style={{ color: fav ? "#f59e0b" : "var(--text-muted)", opacity: fav ? 1 : 0.3, flexShrink: 0 }}
                      >
                        <Star size={11} fill={fav ? "currentColor" : "none"} />
                      </button>
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
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
                        <div className="min-w-0">
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
                        <span className="font-data text-[10px] tabular-nums" style={{ color: c }}>
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

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-data text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
            DATA: DEXSCREENER · LIVE STREAM · 10S CACHE
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
