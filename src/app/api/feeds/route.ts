import { NextResponse } from "next/server";

export type LiveFeed = {
  id: string;
  label: string;
  sublabel: string;
  // YouTube channel ID — always shows whatever is currently live on that channel
  channelId: string;
  bias: "mainstream" | "alternative" | "international" | "crypto" | "hostile";
  accentColor: string;
};

const FEEDS: LiveFeed[] = [
  {
    id: "bloomberg",
    label: "BLOOMBERG MARKETS",
    sublabel: "MAINSTREAM — FINANCIAL",
    channelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
    bias: "mainstream",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "cnbc",
    label: "CNBC TELEVISION",
    sublabel: "MAINSTREAM — EQUITIES",
    channelId: "UCvJJ_dzjViJCoLf5uKUTwoA",
    bias: "mainstream",
    accentColor: "var(--signal-amber)",
  },
  {
    id: "foxbusiness",
    label: "FOX BUSINESS",
    sublabel: "HOSTILE — RIGHT FLANK",
    channelId: "UCF9IOB2TExg3QIBupFtBDxg",
    bias: "hostile",
    accentColor: "var(--signal-red)",
  },
  {
    id: "aljazeera",
    label: "AL JAZEERA ENGLISH",
    sublabel: "INTERNATIONAL — GLOBAL",
    channelId: "UCNye-wNBqNL5ZzHSJdpkDEA",
    bias: "international",
    accentColor: "var(--signal-green)",
  },
  {
    id: "skynews",
    label: "SKY NEWS",
    sublabel: "INTERNATIONAL — UK",
    channelId: "UCoMdktPbSTixAyNGwb-UYkQ",
    bias: "international",
    accentColor: "var(--signal-cyan)",
  },
  {
    id: "wion",
    label: "WION",
    sublabel: "INTERNATIONAL — INDIA",
    channelId: "UCMNEGiE-e4ChqCJQwQMEhSQ",
    bias: "international",
    accentColor: "var(--signal-amber)",
  },
];

export async function GET() {
  return NextResponse.json({ feeds: FEEDS });
}
