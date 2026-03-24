import { NextResponse } from "next/server";
import { FEEDS } from "@/app/api/feeds/route";

export type LiveStatus = {
  feedId: string;
  videoId: string | null;
  live: boolean;
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** Extract an 11-char YouTube video ID from a URL or HTML blob */
function extractVideoId(text: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,                      // URL param
    /"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/,           // JSON in HTML
    /\/embed\/([a-zA-Z0-9_-]{11})/,                    // embed URL
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,                  // short URL
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return m[1];
  }
  return null;
}

async function resolveChannelLive(
  channelId: string,
  staticVideoId?: string
): Promise<string | null> {
  // For channels with a known static video ID, verify it's still accessible
  // by trying the channel live page first (so we pick up if the ID rotated)
  try {
    const res = await fetch(
      `https://www.youtube.com/channel/${channelId}/live`,
      {
        redirect: "follow",
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(7_000),
      }
    );

    // If the browser was redirected to a /watch URL, the channel is live
    const finalUrl = res.url;
    const fromUrl = extractVideoId(finalUrl);
    if (fromUrl) return fromUrl;

    // Otherwise scan the page HTML for a live video ID
    const html = await res.text();

    // YouTube embeds canonical video data in JSON blobs inside the HTML
    const fromHtml = extractVideoId(html);
    if (fromHtml) return fromHtml;

    // Not currently live — fall back to static ID (known 24/7 streams)
    return staticVideoId ?? null;
  } catch {
    // On any fetch error fall back to the static ID
    return staticVideoId ?? null;
  }
}

// ── In-memory cache ──────────────────────────────────────────────────────────
type Cache = { statuses: LiveStatus[]; fetchedAt: number };
let _cache: Cache | null = null;
const TTL = 3 * 60 * 1_000; // 3 minutes

export async function GET() {
  if (_cache && Date.now() - _cache.fetchedAt < TTL) {
    return NextResponse.json(_cache);
  }

  const statuses = await Promise.all(
    FEEDS.map(async (feed): Promise<LiveStatus> => {
      const videoId = await resolveChannelLive(feed.channelId, feed.videoId);
      return { feedId: feed.id, videoId, live: !!videoId };
    })
  );

  _cache = { statuses, fetchedAt: Date.now() };
  return NextResponse.json(_cache);
}
