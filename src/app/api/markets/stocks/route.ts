import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import type { MarketAsset } from "../crypto/route";

const yf = new YahooFinance();

export const revalidate = 60;

const SYMBOLS = [
  "SPY", "QQQ", "NVDA", "TSLA", "AAPL", "MSFT", "META", "GOOGL",
  "GLD",   // Gold ETF
  "USO",   // Oil ETF
  "^VIX",  // Volatility index
  "^DJI",  // Dow Jones
];

export async function GET() {
  try {
    // Fetch each symbol individually and collect results
    const settled = await Promise.allSettled(
      SYMBOLS.map((sym) => yf.quote(sym))
    );

    const assets: MarketAsset[] = settled
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof yahooFinance.quote>>> =>
        r.status === "fulfilled"
      )
      .map((r) => {
        // quote() with a single symbol returns a single Quote object
        const q = r.value as {
          symbol?: string;
          shortName?: string;
          displayName?: string;
          regularMarketPrice?: number;
          regularMarketChangePercent?: number;
          regularMarketVolume?: number;
        };
        return {
          symbol:    (q.symbol ?? "").replace("^", ""),
          name:      q.shortName ?? q.displayName ?? q.symbol ?? "",
          price:     q.regularMarketPrice ?? 0,
          change24h: q.regularMarketChangePercent ?? 0,
          volume24h: q.regularMarketVolume,
        };
      });

    return NextResponse.json({ assets, ts: Date.now() });
  } catch (err) {
    console.error("[stocks route]", err);
    return NextResponse.json({ error: "Stocks unavailable" }, { status: 502 });
  }
}
