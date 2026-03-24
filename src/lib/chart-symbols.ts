// Maps hero stat card labels → TradingView exchange:symbol
export const TV_SYMBOL_MAP: Record<string, string> = {
  "BTC / USD": "COINBASE:BTCUSD",
  "SOL / USD": "COINBASE:SOLUSD",
  "ZEC / USD": "COINBASE:ZECUSD",
  "SPY":       "AMEX:SPY",
  "VIX":       "CBOE:VIX",
  "NVDA":      "NASDAQ:NVDA",
  "GOLD":      "COMEX:GC1!",
  "SILVER":    "COMEX:SI1!",
  "COPPER":    "COMEX:HG1!",
  "OIL":       "NYMEX:CL1!",
};

export function getTVSymbol(label: string): string {
  return TV_SYMBOL_MAP[label] ?? label;
}

export type ChartAsset = {
  label: string;
  value: string;
  change?: number;
  tvSymbol: string;
  accentColor: string;
};
