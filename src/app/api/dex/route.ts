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

type TokenProfile = {
  tokenAddress: string;
  chainId:      string;
  icon?:        string;
  description?: string;
};

// In-process cache
const cache = new Map<string, { data: DexPair[]; ts: number }>();
const profileCache = new Map<string, string>(); // address → imageUrl
const TTL = 30_000;

// ── Logo resolution ────────────────────────────────────────────────────────

// Fetch the latest token profiles from DexScreener (all have logos)
async function warmProfileCache() {
  try {
    const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return;
    const profiles: TokenProfile[] = await res.json();
    for (const p of profiles) {
      if (p.tokenAddress && p.icon) {
        profileCache.set(p.tokenAddress.toLowerCase(), p.icon);
      }
    }
  } catch {
    // silently fail
  }
}

// Attach logo to a pair — prefer pair's own info.imageUrl, fall back to profile cache
function attachLogo(pair: DexPair): DexPair {
  if (pair.info?.imageUrl) return pair;
  const logo = profileCache.get(pair.baseToken.address.toLowerCase());
  if (logo) {
    return { ...pair, info: { ...pair.info, imageUrl: logo } };
  }
  return pair;
}

// ── Search ─────────────────────────────────────────────────────────────────

async function fetchPairs(q: string): Promise<DexPair[]> {
  const cached = cache.get(q);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`DexScreener ${res.status}`);
  const json = await res.json();
  const pairs: DexPair[] = (json.pairs ?? []).slice(0, 30).map(attachLogo);
  cache.set(q, { data: pairs, ts: Date.now() });
  return pairs;
}

// ── Trending ───────────────────────────────────────────────────────────────
// Step 1: pull latest token profiles (have logos + addresses)
// Step 2: batch-fetch pair data for those token addresses
// Step 3: supplement with high-volume search results

async function fetchTrending(): Promise<DexPair[]> {
  const key = "__trending__";
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  // Warm the profile cache first so logos are available
  await warmProfileCache();

  // Fetch profiles to get token addresses with known logos
  let profileAddresses: string[] = [];
  try {
    const res = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const profiles: TokenProfile[] = await res.json();
      // Group addresses by chain, take top 10 per chain (max 30 addresses per API call)
      const byChain: Record<string, string[]> = {};
      for (const p of profiles.slice(0, 50)) {
        if (!byChain[p.chainId]) byChain[p.chainId] = [];
        if (byChain[p.chainId].length < 8) byChain[p.chainId].push(p.tokenAddress);
      }
      profileAddresses = Object.values(byChain).flat().slice(0, 30);
    }
  } catch {
    // fall through to search-only
  }

  // Fetch pair data for profiled token addresses
  const pairsFromProfiles: DexPair[] = [];
  if (profileAddresses.length > 0) {
    try {
      // DexScreener allows comma-separated addresses (max 30)
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${profileAddresses.join(",")}`,
        { headers: { Accept: "application/json" } }
      );
      if (res.ok) {
        const json = await res.json();
        const pairs: DexPair[] = (json.pairs ?? []).filter(
          (p: DexPair) => p.priceUsd && Number(p.priceUsd) > 0
        );
        // Best pair per token (highest liquidity)
        const bestPair = new Map<string, DexPair>();
        for (const p of pairs) {
          const addr = p.baseToken.address;
          const existing = bestPair.get(addr);
          if (!existing || (p.liquidity?.usd ?? 0) > (existing.liquidity?.usd ?? 0)) {
            bestPair.set(addr, attachLogo(p));
          }
        }
        pairsFromProfiles.push(...bestPair.values());
      }
    } catch {
      // fall through
    }
  }

  // Supplement with high-volume search results
  const SEARCH_QUERIES = ["SOL", "ETH", "BTC", "PEPE", "WIF", "BONK", "TRUMP"];
  const settled = await Promise.allSettled(SEARCH_QUERIES.map(fetchPairs));
  const searchPairs: DexPair[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") searchPairs.push(...r.value);
  }

  // Merge, dedupe by pairAddress, sort by 24h volume
  const all: DexPair[] = [];
  const seen = new Set<string>();
  for (const p of [...pairsFromProfiles, ...searchPairs]) {
    if (!seen.has(p.pairAddress) && p.priceUsd && Number(p.priceUsd) > 0) {
      seen.add(p.pairAddress);
      all.push(p);
    }
  }
  all.sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));

  const top = all.slice(0, 60);
  cache.set(key, { data: top, ts: Date.now() });
  return top;
}

// ── Handler ────────────────────────────────────────────────────────────────

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
