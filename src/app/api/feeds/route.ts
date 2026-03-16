import { NextResponse } from "next/server";

export type FeedCategory = "markets" | "crypto" | "geopolitics" | "macro" | "degen";

export type LiveFeed = {
  id: string;
  label: string;
  sublabel: string;
  channelId: string;
  category: FeedCategory;
  region?: string;
  accentColor: string;
};

export const FEEDS: LiveFeed[] = [
  // ─── MARKETS ────────────────────────────────────────────────────────────────
  {
    id: "bloomberg",
    label: "BLOOMBERG MARKETS",
    sublabel: "US — FINANCIAL",
    channelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "cnbc",
    label: "CNBC TELEVISION",
    sublabel: "US — EQUITIES",
    channelId: "UCvJJ_dzjViJCoLf5uKUTwoA",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "foxbusiness",
    label: "FOX BUSINESS",
    sublabel: "US — RIGHT FLANK",
    channelId: "UCF9IOB2TExg3QIBupFtBDxg",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-red)",
  },
  {
    id: "yahoofinance",
    label: "YAHOO FINANCE",
    sublabel: "US — RETAIL",
    channelId: "UCEAZeUIeJs0IjQiqTCdVSIg",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "tastylive",
    label: "TASTYLIVE",
    sublabel: "US — OPTIONS/DERIVATIVES",
    channelId: "UCKj3eTq3E5DNEKk3Z-RlKaA",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-green)",
  },

  // ─── CRYPTO ─────────────────────────────────────────────────────────────────
  {
    id: "coindesk",
    label: "COINDESK TV",
    sublabel: "CRYPTO — MEDIA",
    channelId: "UCRDLO7dLFGFmBJsj62x00PQ",
    category: "crypto",
    accentColor: "var(--signal-green)",
  },
  {
    id: "cryptobanter",
    label: "CRYPTO BANTER",
    sublabel: "CRYPTO — DEGEN",
    channelId: "UCN9Nj4tjXbVTLYWN0EKly_Q",
    category: "crypto",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "realvision",
    label: "REAL VISION",
    sublabel: "CRYPTO — MACRO ALPHA",
    channelId: "UCXmhQI5pCk7BzTkX_GCBI2Q",
    category: "crypto",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "coinbureau",
    label: "COIN BUREAU",
    sublabel: "CRYPTO — RESEARCH",
    channelId: "UCqK_GSMbpiV8spgD3ZGloSw",
    category: "crypto",
    accentColor: "var(--signal-green)",
  },
  {
    id: "bankless",
    label: "BANKLESS",
    sublabel: "CRYPTO — DEFI",
    channelId: "UCMiIR-6pmb-dblCd5Lp6sbQ",
    category: "crypto",
    accentColor: "var(--signal-magenta)",
  },

  // ─── GEOPOLITICS ────────────────────────────────────────────────────────────
  {
    id: "aljazeera",
    label: "AL JAZEERA",
    sublabel: "INTERNATIONAL — GLOBAL",
    channelId: "UCNye-wNBqNL5ZzHSJdpkDEA",
    category: "geopolitics",
    region: "QATAR",
    accentColor: "var(--signal-green)",
  },
  {
    id: "dwnews",
    label: "DW NEWS",
    sublabel: "INTERNATIONAL — GERMANY",
    channelId: "UCknLrEdhRCp1aegoMqRaCZg",
    category: "geopolitics",
    region: "DE",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "france24",
    label: "FRANCE 24 ENGLISH",
    sublabel: "INTERNATIONAL — FRANCE",
    channelId: "UCQfwfsi5VrQ8yKZ-UWmAoBw",
    category: "geopolitics",
    region: "FR",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "trtworld",
    label: "TRT WORLD",
    sublabel: "INTERNATIONAL — TURKEY",
    channelId: "UC7DHo_yEGFpEFd7DyPPsB3w",
    category: "geopolitics",
    region: "TR",
    accentColor: "var(--signal-red)",
  },
  {
    id: "wion",
    label: "WION",
    sublabel: "INTERNATIONAL — INDIA",
    channelId: "UCMNEGiE-e4ChqCJQwQMEhSQ",
    category: "geopolitics",
    region: "IN",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "nhkworld",
    label: "NHK WORLD",
    sublabel: "INTERNATIONAL — JAPAN",
    channelId: "UCcH3J9cHqPlXo6QerXGdKmg",
    category: "geopolitics",
    region: "JP",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "cgtn",
    label: "CGTN",
    sublabel: "INTERNATIONAL — CHINA",
    channelId: "UCor7CidkIAr8cJ1IAc1g8Bw",
    category: "geopolitics",
    region: "CN",
    accentColor: "var(--signal-red)",
  },
  {
    id: "timesnow",
    label: "TIMES NOW",
    sublabel: "INTERNATIONAL — INDIA",
    channelId: "UCt4t-jeY85JegMlZ-E5UWtA",
    category: "geopolitics",
    region: "IN",
    accentColor: "var(--signal-green)",
  },

  // ─── MACRO ──────────────────────────────────────────────────────────────────
  {
    id: "skynews",
    label: "SKY NEWS",
    sublabel: "MACRO — UK",
    channelId: "UCoMdktPbSTixAyNGwb-UYkQ",
    category: "macro",
    region: "UK",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "bbcnews",
    label: "BBC NEWS",
    sublabel: "MACRO — UK",
    channelId: "UCy2oPSFAYkVOCaHSq9KBnFQ",
    category: "macro",
    region: "UK",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "abcnews",
    label: "ABC NEWS",
    sublabel: "MACRO — US",
    channelId: "UCBi2mrWuNuyYy4gbM6We_aA",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-green)",
  },
  {
    id: "cbsnews",
    label: "CBS NEWS",
    sublabel: "MACRO — US",
    channelId: "UC8moGq5oUmFHVAXxVShWYYQ",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "nbcnews",
    label: "NBC NEWS",
    sublabel: "MACRO — US",
    channelId: "UCeY0bbntWzzVIaj2z3QigXg",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-red)",
  },
  {
    id: "reuters",
    label: "REUTERS",
    sublabel: "MACRO — WIRE",
    channelId: "UChqUTb7kYRX8-EiaN3XFrSQ",
    category: "macro",
    region: "GLOBAL",
    accentColor: "var(--signal-amber)",
  },

  // ─── DEGEN ──────────────────────────────────────────────────────────────────
  {
    id: "cryptobanter-degen",
    label: "CRYPTO BANTER",
    sublabel: "DEGEN — LIVE CALLS",
    channelId: "UCN9Nj4tjXbVTLYWN0EKly_Q",
    category: "degen",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "altcoindaily",
    label: "ALTCOIN DAILY",
    sublabel: "DEGEN — ALT SEASON",
    channelId: "UCbLhGKVY-bJPcawebgtNfbw",
    category: "degen",
    accentColor: "var(--signal-green)",
  },
  {
    id: "investanswers",
    label: "INVEST ANSWERS",
    sublabel: "DEGEN — QUANT",
    channelId: "UCnM64NU-5j6OlAi0JkEGEMg",
    category: "degen",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "eliotrades",
    label: "ELI0TRADES",
    sublabel: "DEGEN — TECHNICAL",
    channelId: "UCGrxiMeNMkTMVaWhSFPCiow",
    category: "degen",
    accentColor: "var(--signal-red)",
  },
];

export const CATEGORIES: { id: FeedCategory; label: string; color: string }[] = [
  { id: "markets",     label: "MARKETS",     color: "var(--signal-cyan)" },
  { id: "crypto",      label: "CRYPTO",      color: "var(--signal-green)" },
  { id: "geopolitics", label: "GEOPOLITICS", color: "var(--signal-amber)" },
  { id: "macro",       label: "MACRO",       color: "var(--signal-red)" },
  { id: "degen",       label: "DEGEN",       color: "var(--signal-magenta)" },
];

export async function GET() {
  return NextResponse.json({ feeds: FEEDS, categories: CATEGORIES });
}
