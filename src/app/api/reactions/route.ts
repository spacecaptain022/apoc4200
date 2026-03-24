import { NextRequest, NextResponse } from "next/server";

export type ReactionEmoji = "💀" | "🔥";
export const EMOJIS: ReactionEmoji[] = ["💀", "🔥"];

export type ReactionCounts = Record<ReactionEmoji, number>;
export type ReactionsMap = Record<string, ReactionCounts>;

// In-memory store — fast, no DB needed, resets on redeploy (fine for personality feature)
const store = new Map<string, ReactionCounts>();

function getOrInit(articleId: string): ReactionCounts {
  if (!store.has(articleId)) {
    store.set(articleId, { "💀": 0, "🔥": 0 });
  }
  return store.get(articleId)!;
}

// GET /api/reactions?ids=id1,id2,id3
export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  const result: ReactionsMap = {};
  for (const id of ids) result[id] = getOrInit(id);
  return NextResponse.json(result);
}

// POST /api/reactions  { articleId, emoji }
export async function POST(req: NextRequest) {
  let body: { articleId?: string; emoji?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }

  const { articleId, emoji } = body;
  if (!articleId || !EMOJIS.includes(emoji as ReactionEmoji)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const counts = getOrInit(articleId);
  counts[emoji as ReactionEmoji]++;
  return NextResponse.json(counts);
}
