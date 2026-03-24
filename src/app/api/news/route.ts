import { NextResponse } from "next/server";

export type NewsCategory = "CRYPTO" | "MARKETS" | "GEOPOLITICS" | "MACRO" | "GLOBAL";
export type NewsUrgency = "breaking" | "developing" | "analysis" | "default";

export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: NewsCategory;
  urgency: NewsUrgency;
  publishedAt: string;
  publishedMs: number;
  mediaUrl?: string;
};

type RSSSource = {
  url: string;
  source: string;
  defaultCategory: NewsCategory;
};

const RSS_SOURCES: RSSSource[] = [
  // ── CRYPTO — edgy / investigative ───────────────────────────────────────
  { url: "https://rekt.news/feed/",                                    source: "REKT NEWS",      defaultCategory: "CRYPTO"      },
  { url: "https://www.theblock.co/rss.xml",                            source: "THE BLOCK",      defaultCategory: "CRYPTO"      },
  { url: "https://protos.com/feed/",                                   source: "PROTOS",         defaultCategory: "CRYPTO"      },
  { url: "https://bitcoinmagazine.com/.rss/full",                      source: "BITCOIN MAG",    defaultCategory: "CRYPTO"      },
  { url: "https://cryptoslate.com/feed/",                              source: "CRYPTOSLATE",    defaultCategory: "CRYPTO"      },
  { url: "https://watcher.guru/news/feed",                             source: "WATCHER GURU",   defaultCategory: "CRYPTO"      },
  { url: "https://www.milkroad.com/feed",                              source: "MILK ROAD",      defaultCategory: "CRYPTO"      },
  { url: "https://dirtybubble.substack.com/feed",                      source: "DIRTY BUBBLE",   defaultCategory: "CRYPTO"      },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/",            source: "COINDESK",       defaultCategory: "CRYPTO"      },
  { url: "https://decrypt.co/feed",                                    source: "DECRYPT",        defaultCategory: "CRYPTO"      },
  { url: "https://cointelegraph.com/rss",                              source: "COINTELEGRAPH",  defaultCategory: "CRYPTO"      },

  // ── MARKETS — counter-narrative ──────────────────────────────────────────
  { url: "https://feeds.feedburner.com/zerohedge/feed",                source: "ZEROHEDGE",      defaultCategory: "MARKETS"     },
  { url: "https://thekobeissiletter.substack.com/feed",                source: "KOBEISSI",       defaultCategory: "MARKETS"     },
  { url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",      source: "CNBC",           defaultCategory: "MARKETS"     },
  { url: "https://www.cnbc.com/id/10000664/device/rss/rss.html",       source: "CNBC",           defaultCategory: "MARKETS"     },
  { url: "https://feeds.reuters.com/reuters/businessNews",             source: "REUTERS",        defaultCategory: "MARKETS"     },

  // ── GEOPOLITICS ──────────────────────────────────────────────────────────
  { url: "https://www.aljazeera.com/xml/rss/all.xml",                  source: "AL JAZEERA",     defaultCategory: "GEOPOLITICS" },
  { url: "https://rss.dw.com/rdf/rss-en-world",                        source: "DW NEWS",        defaultCategory: "GEOPOLITICS" },
  { url: "https://www.france24.com/en/rss",                            source: "FRANCE 24",      defaultCategory: "GEOPOLITICS" },
  { url: "https://feeds.feedburner.com/breitbart",                     source: "BREITBART",      defaultCategory: "GLOBAL"      },

  // ── MACRO / WIRE ─────────────────────────────────────────────────────────
  { url: "https://feeds.reuters.com/reuters/topNews",                  source: "REUTERS",        defaultCategory: "GLOBAL"      },
];

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(
    new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i")
  );
  if (cdataMatch) return cdataMatch[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return plain ? plain[1].replace(/<[^>]+>/g, "").trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i")
  );
  return match ? match[1] : "";
}

function classifyCategory(
  title: string,
  desc: string,
  defaultCat: NewsCategory
): NewsCategory {
  const text = (title + " " + desc).toLowerCase();

  const crypto = ["bitcoin", "btc", "ethereum", "eth", " crypto", "blockchain", "defi", "nft", "web3", "solana", "binance", "coinbase", "altcoin", " token ", "stablecoin", "ledger", "satoshi"];
  const markets = ["stock market", "wall street", "nasdaq", "s&p 500", "dow jones", "federal reserve", " fed ", "interest rate", " earnings", " ipo ", "treasury yield", "bond yield", "hedge fund", "equities", "shares"];
  const geopolitics = [" war ", " wars ", "military", " troops", "china ", "russia", "ukraine", "israel", "hamas", "hezbollah", " iran", " nato ", "sanctions", " missile", "nuclear", "taiwan", "invasion", "diplomatic", "geopolit"];
  const macro = ["inflation", " gdp", "economy", "economic", "recession", "unemployment", "jobs report", "fiscal policy", "monetary policy", "central bank", "imf ", "world bank", "interest rates", "consumer price"];

  if (crypto.some((k) => text.includes(k))) return "CRYPTO";
  if (geopolitics.some((k) => text.includes(k))) return "GEOPOLITICS";
  if (markets.some((k) => text.includes(k))) return "MARKETS";
  if (macro.some((k) => text.includes(k))) return "MACRO";
  return defaultCat;
}

function classifyUrgency(title: string, publishedMs: number): NewsUrgency {
  const ageMs = Date.now() - publishedMs;
  const oneHour = 60 * 60 * 1000;
  const sixHours = 6 * oneHour;
  const titleLower = title.toLowerCase();

  const analysisWords = ["analysis:", "opinion:", " why ", " how ", "explained", "what is", "what are", "deep dive"];
  if (analysisWords.some((w) => titleLower.includes(w))) return "analysis";
  if (ageMs < oneHour) return "breaking";
  if (ageMs < sixHours) return "developing";
  return "default";
}

function formatPublishedAt(publishedMs: number): string {
  const ageMs = Date.now() - publishedMs;
  const mins = Math.floor(ageMs / 60_000);
  const hours = Math.floor(mins / 60);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  if (hours < 24) return `${hours}H AGO`;
  return "YESTERDAY";
}

async function fetchFeed(source: RSSSource): Promise<NewsArticle[]> {
  try {
    const res = await fetch(source.url, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsCoin/1.0; +https://newscoin.app)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const articles: NewsArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null && count < 10) {
      const item = match[1];
      const title = extractTag(item, "title");
      const description = extractTag(item, "description");
      const link =
        extractTag(item, "link") ||
        extractAttr(item, "link", "href") ||
        extractTag(item, "guid");
      const pubDate =
        extractTag(item, "pubDate") ||
        extractTag(item, "dc:date") ||
        extractTag(item, "published");
      const mediaUrl =
        extractAttr(item, "media:content", "url") ||
        extractAttr(item, "media:thumbnail", "url") ||
        extractAttr(item, "enclosure", "url");

      if (!title || !link) continue;
      const publishedMs = pubDate ? new Date(pubDate).getTime() : Date.now();
      if (isNaN(publishedMs)) continue;

      const category = classifyCategory(title, description, source.defaultCategory);
      const urgency = classifyUrgency(title, publishedMs);

      articles.push({
        id: Buffer.from(link).toString("base64").slice(0, 20),
        title: title.toUpperCase().replace(/&AMP;/gi, "&").replace(/&QUOT;/gi, '"'),
        description: description.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#\d+;/g, ""),
        url: link.startsWith("http") ? link : `https://${link}`,
        source: source.source,
        category,
        urgency,
        publishedAt: formatPublishedAt(publishedMs),
        publishedMs,
        mediaUrl: mediaUrl || undefined,
      });
      count++;
    }

    return articles;
  } catch {
    return [];
  }
}

// In-memory cache for server-side
let _cache: { articles: NewsArticle[]; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1_000;

export async function GET() {
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json({ articles: _cache.articles, fetchedAt: _cache.fetchedAt });
  }

  const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));
  const seen = new Set<string>();
  const allArticles = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => {
      // Deduplicate by title prefix
      const key = a.title.slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.publishedMs - a.publishedMs)
    .slice(0, 60);

  _cache = { articles: allArticles, fetchedAt: Date.now() };

  return NextResponse.json({ articles: allArticles, fetchedAt: _cache.fetchedAt });
}
