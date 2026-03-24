import { NextResponse } from "next/server";

export type FeedCategory = "markets" | "crypto" | "geopolitics" | "macro" | "degen";

export type LiveFeed = {
  id: string;
  label: string;
  sublabel: string;
  channelId: string;
  videoId?: string; // persistent live stream video ID — overrides channel embed
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
    videoId: "dp8PhLsUcFE",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "cnbc",
    label: "CNBC TELEVISION",
    sublabel: "US — EQUITIES",
    channelId: "UCvJJ_dzjViJCoLf5uKUTwoA",
    videoId: "sMO2lHbRDVc",
    category: "markets",
    region: "US",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "foxbusiness",
    label: "FOX BUSINESS",
    sublabel: "US — RIGHT FLANK",
    channelId: "UCF9IOB2TExg3QIBupFtBDxg",
    videoId: "pOoN5MoIeA8",
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
    sublabel: "CRYPTO — LIVE CALLS",
    channelId: "UCN9Nj4tjXbVTLYWN0EKly_Q",
    category: "crypto",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "blockworks",
    label: "BLOCKWORKS",
    sublabel: "CRYPTO — MACRO ALPHA",
    channelId: "UCvVfVGALZJCCJjqTQ_ykRfA",
    category: "crypto",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "kitco-crypto",
    label: "KITCO NEWS",
    sublabel: "CRYPTO — GOLD & MACRO",
    channelId: "UCJ5yhZ4-8LNyME65leOFLkA",
    category: "crypto",
    accentColor: "var(--signal-amber)",
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
    videoId: "ykVs5eLtLiA",
    category: "geopolitics",
    region: "QATAR",
    accentColor: "var(--signal-green)",
  },
  {
    id: "dwnews",
    label: "DW NEWS",
    sublabel: "INTERNATIONAL — GERMANY",
    channelId: "UCknLrEdhRCp1aegoMqRaCZg",
    videoId: "mGbCyd6GkUY",
    category: "geopolitics",
    region: "DE",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "france24",
    label: "FRANCE 24 ENGLISH",
    sublabel: "INTERNATIONAL — FRANCE",
    channelId: "UCQfwfsi5VrQ8yKZ-UWmAoBw",
    videoId: "l8PMl7tUDIE",
    category: "geopolitics",
    region: "FR",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "trtworld",
    label: "TRT WORLD",
    sublabel: "INTERNATIONAL — TURKEY",
    channelId: "UC7DHo_yEGFpEFd7DyPPsB3w",
    videoId: "D5YBemNcifA",
    category: "geopolitics",
    region: "TR",
    accentColor: "var(--signal-red)",
  },
  {
    id: "wion",
    label: "WION",
    sublabel: "INTERNATIONAL — INDIA",
    channelId: "UCMNEGiE-e4ChqCJQwQMEhSQ",
    videoId: "M6tGDZLWd50",
    category: "geopolitics",
    region: "IN",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "nhkworld",
    label: "NHK WORLD",
    sublabel: "INTERNATIONAL — JAPAN",
    channelId: "UCcH3J9cHqPlXo6QerXGdKmg",
    videoId: "aVAGszW6MgM",
    category: "geopolitics",
    region: "JP",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "cgtn",
    label: "CGTN",
    sublabel: "INTERNATIONAL — CHINA",
    channelId: "UCor7CidkIAr8cJ1IAc1g8Bw",
    videoId: "z9IblqwrBQo",
    category: "geopolitics",
    region: "CN",
    accentColor: "var(--signal-red)",
  },
  {
    id: "timesnow",
    label: "TIMES NOW",
    sublabel: "INTERNATIONAL — INDIA",
    channelId: "UCt4t-jeY85JegMlZ-E5UWtA",
    videoId: "4aVpKQZ2nLw",
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
    videoId: "9Auq9mYxFEE",
    category: "macro",
    region: "UK",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "bbcnews",
    label: "BBC NEWS",
    sublabel: "MACRO — UK",
    channelId: "UCy2oPSFAYkVOCaHSq9KBnFQ",
    videoId: "w_Ma8oQLmSM",
    category: "macro",
    region: "UK",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "abcnews",
    label: "ABC NEWS",
    sublabel: "MACRO — US",
    channelId: "UCBi2mrWuNuyYy4gbM6We_aA",
    videoId: "W1yKqFZ68Ao",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-green)",
  },
  {
    id: "cbsnews",
    label: "CBS NEWS",
    sublabel: "MACRO — US",
    channelId: "UC8moGq5oUmFHVAXxVShWYYQ",
    videoId: "8i_WT9OObxQ",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "nbcnews",
    label: "NBC NEWS",
    sublabel: "MACRO — US",
    channelId: "UCeY0bbntWzzVIaj2z3QigXg",
    videoId: "F5uUBEFEgMQ",
    category: "macro",
    region: "US",
    accentColor: "var(--signal-red)",
  },
  {
    id: "reuters",
    label: "REUTERS NOW",
    sublabel: "MACRO — WIRE",
    channelId: "UChqUTb7kYRX8-EiaN3XFrSQ",
    videoId: "LQv5LFnAqkQ",
    category: "macro",
    region: "GLOBAL",
    accentColor: "var(--signal-amber)",
  },

  // ─── DEGEN ──────────────────────────────────────────────────────────────────
  {
    id: "euronews",
    label: "EURONEWS",
    sublabel: "DEGEN — EUROPE",
    channelId: "UCg2KZeJlAAoBFJUBNHomnKA",
    videoId: "yhtnx5b2AKk",
    category: "degen",
    region: "EU",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "i24news",
    label: "i24 NEWS",
    sublabel: "DEGEN — MIDDLE EAST",
    channelId: "UCs6nmQViDpUw0nuIx9c_WdA",
    videoId: "H3MFe1OAQIE",
    category: "degen",
    region: "IL",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "newsy",
    label: "NEWSY",
    sublabel: "DEGEN — ALT SIGNAL",
    channelId: "UCeeFfhMcJa1kjtfZAGskOCA",
    category: "degen",
    region: "US",
    accentColor: "var(--signal-green)",
  },
  {
    id: "cna",
    label: "CNA",
    sublabel: "DEGEN — ASIA PACIFIC",
    channelId: "UC4ghLGBCjuTpSbNDlcQMhzA",
    videoId: "Nh6J4n9olis",
    category: "degen",
    region: "SG",
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
