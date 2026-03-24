import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// DexScreener pair shape (trimmed to what we use)
export type DexPair = {
  chainId:     string;
  dexId:       string;
  url:         string;
  pairAddress: string;
  baseToken:   { address: string; name: string; symbol: string };
  quoteToken:  { address: string; name: string; symbol: string };
  priceNative: string;
  priceUsd:    string;
  txns:        { h24?: { buys: number; sells: number } };
  volume:      { h24?: number; h6?: number; h1?: number };
  priceChange: { h1?: number; h6?: number; h24?: number };
  liquidity?:  { usd?: number };
  fdv?:        number;
  marketCap?:  number;
  info?:       { imageUrl?: string };
};

// Simple in-process cache
const cache = new Map<string, { data: DexPair[]; ts: number }>();
const TTL = 30_000; // 30s

async function fetchPairs(q: string): Promise<DexPair[]> {
  const cached = cache.get(q);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`,
    { headers: { Accept: "application/json" }, next: { revalidate: 30 } }
  );
  if (!res.ok) throw new Error(`DexScreener ${res.status}`);
  const json = await res.json();
  const pairs: DexPair[] = (json.pairs ?? []).slice(0, 30);
  cache.set(q, { data: pairs, ts: Date.now() });
  return pairs;
}

// Trending: fetch several popular searches and dedupe by pairAddress, sort by 24h volume
const TRENDING_QUERIES = ["SOL", "ETH", "BTC", "PEPE", "WIF"];

async function fetchTrending(): Promise<DexPair[]> {
  const key = "__trending__";
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  const settled = await Promise.allSettled(TRENDING_QUERIES.map(fetchPairs));
  const all: DexPair[] = [];
  const seen = new Set<string>();

  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const p of r.value) {
      if (!seen.has(p.pairAddress) && p.priceUsd && Number(p.priceUsd) > 0) {
        seen.add(p.pairAddress);
        all.push(p);
      }
    }
  }

  // Sort by 24h volume descending
  all.sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
  const top = all.slice(0, 50);
  cache.set(key, { data: top, ts: Date.now() });
  return top;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  try {
    const pairs = q ? await fetchPairs(q) : await fetchTrending();
    return NextResponse.json({ pairs, ts: Date.now() });
  } catch (err) {
    console.error("[dex route]", err);
    return NextResponse.json({ error: "DEX data unavailable" }, { status: 502 });
  }
}
