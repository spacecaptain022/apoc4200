import { NextResponse } from "next/server";

// Returns top movers from both crypto + stocks by combining both endpoints
export async function GET(req: Request) {
  const base = new URL(req.url).origin;

  try {
    const [cryptoRes, stocksRes] = await Promise.all([
      fetch(`${base}/api/markets/crypto`, { next: { revalidate: 30 } }),
      fetch(`${base}/api/markets/stocks`, { next: { revalidate: 60 } }),
    ]);

    const [cryptoData, stocksData] = await Promise.all([
      cryptoRes.json(),
      stocksRes.json(),
    ]);

    const all = [
      ...(cryptoData.assets ?? []),
      ...(stocksData.assets ?? []),
    ];

    const gainers = [...all]
      .filter((a) => a.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 5);

    const losers = [...all]
      .filter((a) => a.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h)
      .slice(0, 5);

    return NextResponse.json({ gainers, losers, ts: Date.now() });
  } catch (err) {
    console.error("[movers route]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
