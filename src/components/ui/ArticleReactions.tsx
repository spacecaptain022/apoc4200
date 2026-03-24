"use client";

import { useState, useEffect, useCallback } from "react";
import { EMOJIS, type ReactionEmoji, type ReactionCounts } from "@/app/api/reactions/route";

type Props = { articleId: string };

const STORAGE_KEY = "nc_reactions";

function getUserReactions(): Record<string, ReactionEmoji[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

function saveUserReaction(articleId: string, emoji: ReactionEmoji) {
  const all = getUserReactions();
  all[articleId] = [...new Set([...(all[articleId] ?? []), emoji])];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function removeUserReaction(articleId: string, emoji: ReactionEmoji) {
  const all = getUserReactions();
  all[articleId] = (all[articleId] ?? []).filter((e) => e !== emoji);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function ArticleReactions({ articleId }: Props) {
  const [counts, setCounts]   = useState<ReactionCounts | null>(null);
  const [myReacts, setMyReacts] = useState<ReactionEmoji[]>([]);
  const [pending, setPending] = useState<ReactionEmoji | null>(null);

  useEffect(() => {
    setMyReacts(getUserReactions()[articleId] ?? []);
    fetch(`/api/reactions?ids=${articleId}`)
      .then((r) => r.json())
      .then((d) => setCounts(d[articleId] ?? null))
      .catch(() => {});
  }, [articleId]);

  const react = useCallback(async (emoji: ReactionEmoji) => {
    if (pending) return;
    const already = myReacts.includes(emoji);

    // Optimistic update
    setCounts((prev) => {
      if (!prev) return prev;
      return { ...prev, [emoji]: Math.max(0, prev[emoji] + (already ? -1 : 1)) };
    });

    if (already) {
      removeUserReaction(articleId, emoji);
      setMyReacts((m) => m.filter((e) => e !== emoji));
    } else {
      saveUserReaction(articleId, emoji);
      setMyReacts((m) => [...m, emoji]);
    }

    if (!already) {
      setPending(emoji);
      try {
        const res = await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, emoji }),
        });
        if (res.ok) setCounts(await res.json());
      } catch {}
      setPending(null);
    }
  }, [articleId, myReacts, pending]);

  return (
    <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
      {EMOJIS.map((emoji) => {
        const active = myReacts.includes(emoji);
        const count  = counts?.[emoji] ?? 0;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => react(emoji)}
            className="flex items-center gap-1 border px-1.5 py-0.5 transition-all duration-150"
            style={{
              borderColor:     active ? "var(--signal-amber)" : "var(--border-subtle)",
              backgroundColor: active ? "rgba(255,176,0,0.08)" : "transparent",
              borderRadius:    "var(--radius-sm)",
              opacity:         pending && pending !== emoji ? 0.5 : 1,
            }}
            title={active ? "Remove reaction" : "React"}
          >
            <span style={{ fontSize: "11px", lineHeight: 1 }}>{emoji}</span>
            {count > 0 && (
              <span
                className="font-data text-[9px] tabular-nums"
                style={{ color: active ? "var(--signal-amber)" : "var(--text-muted)" }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
