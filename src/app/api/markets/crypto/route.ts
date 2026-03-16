import { NextResponse } from "next/server";

export const revalidate = 30; // cache 30s on the CDN

export type MarketAsset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h?: number;
};

const COIN_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "dogecoin",
  "avalanche-2",
  "chainlink",
  "arbitrum",
  "ripple",
  "sui",
  "zcash",
];

const SYMBOL_MAP: Record<string, string> = {
  bitcoin:     "BTC",
  ethereum:    "ETH",
  solana:      "SOL",
  binancecoin: "BNB",
  dogecoin:    "DOGE",
  "avalanche-2": "AVAX",
  chainlink:   "LINK",
  arbitrum:    "ARB",
  ripple:      "XRP",
  sui:         "SUI",
  zcash:       "ZEC",
};

const NAME_MAP: Record<string, string> = {
  bitcoin:     "Bitcoin",
  ethereum:    "Ethereum",
  solana:      "Solana",
  binancecoin: "BNB",
  dogecoin:    "Dogecoin",
  "avalanche-2": "Avalanche",
  chainlink:   "Chainlink",
  arbitrum:    "Arbitrum",
  ripple:      "XRP",
  sui:         "Sui",
  zcash:       "Zcash",
};

export async function GET() {
  try {
    const ids = COIN_IDS.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "CoinGecko unavailable" }, { status: 502 });
    }

    const raw = await res.json();

    const assets: MarketAsset[] = COIN_IDS.map((id) => {
      const d = raw[id] ?? {};
      return {
        symbol:    SYMBOL_MAP[id] ?? id.toUpperCase(),
        name:      NAME_MAP[id] ?? id,
        price:     d.usd ?? 0,
        change24h: d.usd_24h_change ?? 0,
        volume24h: d.usd_24h_vol,
      };
    });

    return NextResponse.json({ assets, ts: Date.now() });
  } catch (err) {
    console.error("[crypto route]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
